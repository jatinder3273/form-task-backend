import Auth from "./auth/auth";
import Common from "./common/common";
import User from "./user/user";
import Task from "./task/task";
export default class Routes {
  constructor(router, db) {
    this.router = router;
    this.DatabaseConnect = db;
  }

  async register() {
    /*** Front end Apis  For Version 1 ****/

    this.db = await this.DatabaseConnect.getDB();

    this.auth = new Auth(this.router, this.db);
    await this.auth.routes();

    this.common = new Common(this.router, this.db);
    await this.common.routes();

    this.user = new User(this.router, this.db);
    await this.user.routes();

    this.task = new Task(this.router, this.db);
    await this.task.routes();
  }
}
