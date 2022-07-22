/* eslint-disable no-useless-catch */
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import DB from '../src/helpers/db';
import Routes from '../src/routes';
import swaggerDocument from '../config/swagger.json';
import authMiddleWare from '../src/helpers/middlewares';
const morgan = require('morgan');

class Server {
  constructor() {
    this.app = null;
    this.db = null;
  }

  async initServer() {
    try {
      this.app = await express();
      this.app.use(bodyParser.json({ limit: '200mb' }));
      this.app.use(bodyParser.urlencoded({ limit: '200mb', extended: true, parameterLimit: 1000000 }));
      this.app.use(cookieParser());
      this.app.set('view engine', 'ejs');
      this.app.use(express.static(path.join(__dirname, '../', 'public')));
      this.app.use(morgan('tiny'));

      this.app.use(
        cors({
          exposeHeaders: [
            'date',
            'content-type',
            'content-length',
            'connection',
            'server',
            'x-powered-by',
            'access-control-allow-origin',
            'authorization',
            'x-final-url',
          ],
          allowHeaders: ['content-type', 'accept', 'authorization'],
        }),
      );
      this.app.use(helmet());
      this.app.use(authMiddleWare);

      this.db = new DB();
      await this.db.init();
      await this.healthCheckRoute();
      await this.healthyDB();
      await this.configureRoutes(this.db);
      this.app.use('/api-docs', swaggerUi.serve);
      this.app.get('/api-docs', swaggerUi.setup(swaggerDocument));
      return this.app;
    } catch (err) {
      throw err;
    }
  }

  async healthCheckRoute() {
    try {
      this.app.get('/', (req, res) => {
        res.json({
          status: 'HEALTHY',
          msg: 'This works perfectly fine',
        });
      });
    } catch (err) {
      throw err;
    }
  }

  async healthyDB() {
    try {
      if (await this.db.checkConnection()) {
        this.app.get('/health', (req, res) => {
          res.json({
            msg: 'DB Connection Successfull',
          });
        });
        return;
      }
      throw new Error('Error connecting to DB');
    } catch (err) {
      throw err;
    }
  }

  async configureRoutes(db) {
    this.router = express.Router();

    const routes = new Routes(this.router, db);

    await routes.register();

    this.app.use(this.router);
  }
}

export default Server;
