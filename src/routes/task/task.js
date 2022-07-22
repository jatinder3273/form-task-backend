import taskController from "../../controllers/task/task";
import schemaValidator from "../../helpers/schemaValidator";
import { taskValidator } from "../../validators/task/task";

export default class Task {
  constructor(router, db) {
    this.router = router;
    this.db = db;
    this.taskInstance = new taskController();
  }

  async routes() {
    await this.taskInstance.init(this.db);

    /*** add new task ***/
    this.router
      .route("/task/add")
      .post(schemaValidator(taskValidator), (req, res) =>
        this.taskInstance.addTask(req, res)
      );
  }
}
