import Logger from "../../helpers/logger";
import { RESPONSE_CODES } from "../../../config/constants";
import { successResponse } from "../../../config/responseHelper";

export default class Task {
  async init(db) {
    this.logger = new Logger();
    await this.logger.init();
    this.Models = db.models;
  }

  /***  register new user  ***/
  async addTask(details) {
    // console.log(this.Models, "this.Models");
    try {
      const taskDetail = await this.Models.Tasks.create(details, {
        raw: true,
      });
      const taskData = await this.Models.Tasks.findOne({
        where: { id: taskDetail.id },
      });

      return successResponse(
        "Task added successfully!",
        taskData,
        RESPONSE_CODES.POST
      );
    } catch (error) {
      this.logger.logError("Task Adding Error: ", error);
      throw error;
    }
  }
}
