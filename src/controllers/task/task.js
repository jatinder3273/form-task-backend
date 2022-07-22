import { RESPONSE_CODES } from "../../../config/constants";
import Logger from "../../helpers/logger";
import Services from "../../services/task/task";
import { CUSTOM_MESSAGES } from "../../../config/customMessages";

export default class Task {
  async init(db) {
    this.services = new Services();
    this.logger = new Logger();
    this.Models = db.models;
    await this.services.init(db);
    await this.logger.init();
  }
  async addTask(req, res) {
    let { body } = req;
    try {
      const taskDetail = await this.services.addTask(body);
      return res.status(taskDetail.code).json(taskDetail);
    } catch (error) {
      const response = {
        status: 0,
        message: CUSTOM_MESSAGES.ERROR,
        code: RESPONSE_CODES.SERVER_ERROR,
        error: error.message,
      };
      return res.json(response);
    }
  }
}
