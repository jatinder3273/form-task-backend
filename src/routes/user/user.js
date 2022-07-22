import userController from '../../controllers/user/user';
import Authorization from '../../helpers/authorization';

export default class User {
    constructor(router, db) {
        this.authorization = new Authorization();
        this.router = router;
        this.db = db;
        this.userInstance = new userController();
    }

    async routes() {
        await this.userInstance.init(this.db);
        await this.authorization.init(this.db);
    }
}