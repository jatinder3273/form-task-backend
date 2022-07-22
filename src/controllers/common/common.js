import { RESPONSE_CODES } from '../../../config/constants';
import Logger from "../../helpers/logger";
import Services from '../../services/common/common';
import { CUSTOM_MESSAGES } from '../../../config/customMessages';
import { saveApiLog, updateApiLog } from '../../helpers/commonFunctions'

export default class Common {
    async init(db) {
        this.services = new Services();
        this.logger = new Logger();
        this.Models = db.models;
        await this.services.init(db);
        await this.logger.init();
    }

    async uploadFiles (req,res) {
        let response, api_logs;
        try{
            const {files, body} = req;
            api_logs = await saveApiLog(this.Models, null, "uploadFiles","Upload files", body)
            response = await this.services.uploadFiles(files, body.type);
            await updateApiLog(this.Models,null, api_logs.id, response,response.message)
            return res.json(response);
        }catch(error){
            response = {
                status: 0,
                message: CUSTOM_MESSAGES.ERROR,
                code: RESPONSE_CODES.SERVER_ERROR,
                error: error.message
            }
            await updateApiLog(this.Models, null, api_logs.id, response, error.message)
            return res.json(response);
        }
    }

}
