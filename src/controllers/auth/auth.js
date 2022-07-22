import { RESPONSE_CODES } from '../../../config/constants';
import Logger from "../../helpers/logger";
import Services from '../../services/auth/auth';
import { CUSTOM_MESSAGES } from '../../../config/customMessages';
import { saveApiLog, updateApiLog } from '../../helpers/commonFunctions';

export default class Auth {
    async init(db) {
        this.services = new Services();
        this.logger = new Logger();
        this.Models = db.models;
        await this.services.init(db);
        await this.logger.init();
    }

    async checkCnpj(req,res){
        let api_logs
        try {
            const { body } = req;
            api_logs = await saveApiLog(this.Models, null, "Check Cnpj Exist In Inusrance Company", "Check Cnpj Exist In Inusrance Company",body)
            const userDetail = await this.services.checkCnpj(body);
            await updateApiLog(this.Models, null, api_logs.id, userDetail, "Check Cnpj Exist In Inusrance Company")
            return res.status(userDetail.code).json(userDetail);
        } catch (error) {
            const response = {
                status: 0,
                message: CUSTOM_MESSAGES.ERROR,
                code: RESPONSE_CODES.SERVER_ERROR,
                error: error.message
            }
            await updateApiLog(this.Models, null, api_logs.id, response, error.message )
            return res.json(response);
        }
    }
    async userRegistration(req, res) {
        let { body } = req;
        try {
            const api_logs = await saveApiLog(this.Models, null, "UserRegister", "User registeration",body)
            const userDetail = await this.services.userRegistration(body);
            /**message update for api_logs */
            const message = userDetail.status == 0 ? userDetail.message : "User register successfully"
            await updateApiLog(this.Models, userDetail.id, api_logs.id, userDetail, message )
            return res.status(userDetail.code).json(userDetail);
        } catch (error) {
            const response = {
                status: 0,
                message: CUSTOM_MESSAGES.ERROR,
                code: RESPONSE_CODES.SERVER_ERROR,
                error: error.message
            }
            await updateApiLog(this.Models, null, api_logs.id, response, error.message)
            return res.json(response);
        }
    }
    async login(req, res) {
        let api_logs,response
        try {
            const { body } = req;
            const api_logs = await saveApiLog(this.Models, null, "AuthLogin","Auht login", body)
            response = await this.services.login(body);
            /**message update for api_logs */
            const message = response.status == 0 ? response.message : "User Login successfully."
            await updateApiLog(this.Models, null, api_logs.id, response, message)
            return res.status(response.code).json(response);
        } catch (error) {
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

    async updatePassword(req, res) {
        let api_logs, response
        try {
            const userData = req.user;
            const { body } = req;
            api_logs = await saveApiLog(this.Models, null, "updatePassword", 
            "Update Password",body)
            response = await this.services.updatePassword(userData, body);
            await updateApiLog(this.Models, null, api_logs.id, response, response.message)
            return res.json(response);
        } catch (error) {
            response = {
                status: 0,
                message: CUSTOM_MESSAGES.ERROR,
                code: RESPONSE_CODES.SERVER_ERROR,
                error: error.message
            }
            await updateApiLog(this.Models, null, api_logs.id, response, error.message )
            return res.json(response);
        }
    }

    async forgotPassword(req, res) {

        let { body } = req;
        let api_logs,response;
        try {  
            api_logs = await saveApiLog(this.Models, null, "forgotPassword","Forgot password", body)
            response = await this.services.forgotPassword(body);
            await updateApiLog(this.Models,null, api_logs.id, response,response.message)
            return res.json(response);
        } catch (error) {
            response = {
                status: 0,
                message: CUSTOM_MESSAGES.ERROR,
                code: RESPONSE_CODES.SERVER_ERROR,
                error: error.message
            }
            await updateApiLog(this.Models, null, api_logs.id, response, error.message)
            return res.json(response)
        }
    }

    async resetPassword(req, res) {
        let { body, params } = req;
        let api_logs, response;
        try {
            api_logs = await saveApiLog(this.Models, null, "resetPassword","Reset password", body)
            response = await this.services.resetPassword(body, params);
            await updateApiLog(this.Models,null, api_logs.id, response,response.message)
            return res.json(response);
        } catch (error) {
            response = {
                status: 0,
                message: CUSTOM_MESSAGES.ERROR,
                code: RESPONSE_CODES.SERVER_ERROR,
                error: error.message
            }
            await updateApiLog(this.Models, null, api_logs.id, response, error.message)
            return res.json(response)
        }
    }

}