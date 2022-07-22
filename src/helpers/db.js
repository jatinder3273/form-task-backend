import config from "config";
import Sequelize from "sequelize";
export default class DB {
  constructor() {
    this.seqClient = null;
    this.dbConfig = config.db;
    this.mysqlConfigClient = this.dbConfig.mysql.client;
    this.db = {};
    this.isDbRunning = true;
  }

  async connectMySQLClient() {
    // eslint-disable-next-line no-useless-catch
    try {
      this.seqClient = new Sequelize(
        this.mysqlConfigClient.database,
        this.mysqlConfigClient.username,
        this.mysqlConfigClient.password,
        {
          host: this.mysqlConfigClient.host,
          port: this.mysqlConfigClient.port,
          dialect: this.mysqlConfigClient.dialect,
          operatorsAliases: false,
          pool: {
            min: this.mysqlConfigClient.pool.min,
            max: this.mysqlConfigClient.pool.max,
            idle: this.mysqlConfigClient.pool.idle,
          },
          define: {
            underscored: true,
          },
          logging: false,
          timezone: "America/New_York",
          dialectOptions: {
            timezone: "local",
          },
        }
      );

      this.seqClient
        .authenticate()
        .then(() => {
          console.log(
            "Connection to Client DB has been established successfully."
          );
        })
        .catch((err) => {
          console.error("Unable to connect to the Client database:", err);
        });
    } catch (err) {
      throw err;
    }
  }

  async init() {
    await this.connectMySQLClient();
    await this.setupModels();
  }

  async checkConnection() {
    try {
      return this.isDbRunning;
    } catch (error) {
      return !this.isDbRunning;
    }
  }

  async setupModels() {
    this.db.sqlClient = this.seqClient;
    this.db.models = {};
    this.db.models.Roles = this.seqClient.import(
      "../../database/models/roles.js"
    );
    this.db.models.Api_logs = this.seqClient.import(
      "../../database/models/api_logs.js"
    );
    this.db.models.Users = this.seqClient.import(
      "../../database/models/users.js"
    );
    this.db.models.Tasks = this.seqClient.import(
      "../../database/models/tasks.js"
    );

    this.db.sqlClient.sync({ alter: true });
  }
  async getDB() {
    return this.db;
  }
}
