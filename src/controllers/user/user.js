import { RESPONSE_CODES } from '../../../config/constants';
import Logger from "../../helpers/logger";
import Services from '../../services/user/user';
import { CUSTOM_MESSAGES } from '../../../config/customMessages';
import { saveApiLog, updateApiLog } from '../../helpers/commonFunctions';

export default class User {
    async init(db) {
        this.services = new Services();
        this.logger = new Logger();
        this.Models = db.models;
        await this.services.init(db);
        await this.logger.init();
    }

    /*** view pending and approved list of Broker ***/
    async getPendingApprovedUserList(req, res) {
        try {
            const { body } = req;
            let response = await this.services.getPendingApprovedUserList(body);
            return res.json(response);
        } catch (error) {
            return res.json({
                status: 0,
                message: CUSTOM_MESSAGES.ERROR,
                code: RESPONSE_CODES.SERVER_ERROR,
                error: error.message
            });
        }
    }

    /*** update user details by id ***/
    async updateUser(req, res) {
        let response, api_logs
        let { body, params } = req;
        try {
            const tokenData = req.user;
            api_logs = await saveApiLog(this.Models, params.id, "updateUser","Update user", body)
            response = await this.services.updateUser(body, params, tokenData);
            await updateApiLog(this.Models, params.id, api_logs.id, response,response.message)
            return res.json(response);
        } catch (error) {
            response = {
                status: 0,
                message: CUSTOM_MESSAGES.ERROR,
                code: RESPONSE_CODES.SERVER_ERROR,
                error: error.message
            }
            await updateApiLog(this.Models, params.id, api_logs.id, response, error.message)
            return res.json(response);
        }
    }
    /*** get user profile details ***/
    async getUserProfile(req, res) {
        try {
            const userDetails = req.user;
            let response = await this.services.getUserProfile(userDetails);
            return res.json(response);
        } catch (error) {
            return res.json({
                status: 0,
                message: CUSTOM_MESSAGES.ERROR,
                code: RESPONSE_CODES.SERVER_ERROR,
                error: error.message
            })
        }
    }

    /*** get user details by id ***/
    async getUserById(req, res) {
        try {
            const { params } = req;
            const tokenData = req.user;
            let response = await this.services.getUserById(params, tokenData);
            return res.json(response);

        } catch (error) {
            return res.json({
                status: 0,
                message: CUSTOM_MESSAGES.ERROR,
                code: RESPONSE_CODES.SERVER_ERROR,
                error: error.message
            })
        }
    }

    /***  list of broker user  ***/
    async userList(req, res) {
        try {
            const { body } = req;
            const tokenData = req.user;
            let result = await this.services.userList(body, tokenData);
            return res.send(result);

        } catch (error) {
            return res.json({
                status: 0,
                message: CUSTOM_MESSAGES.ERROR,
                code: RESPONSE_CODES.SERVER_ERROR,
                error: error.message
            })
        }
    }

    /***  update user access  ***/
    async updateUserAccess(req, res) {
        let api_logs;
        try {
            const { body } = req;
            const tokenData = req.user;
            api_logs = await saveApiLog(this.Models, null, "updateUserAccess","Update user access.", body)
            let result = await this.services.updateUserAccess(body, tokenData);
            await updateApiLog(this.Models, null, api_logs.id, result,result.message)
            return res.send(result);

        } catch (error) {
            const response = {
                status: 0,
                message: CUSTOM_MESSAGES.ERROR,
                code: RESPONSE_CODES.SERVER_ERROR,
                error: error.message
            }
            await updateApiLog(this.Models, null, api_logs.id, response, error.message)
            return res.json(response)
        }
    }

    /*** delete user by id ***/
    async deleteUser(req, res) {
        let { params } = req;
        let api_logs;
        try{
            const tokenData = req.user;
            api_logs = await saveApiLog(this.Models, params.id, "deleteUser", "Delete User",params)
            let result = await this.services.deleteUser(params, tokenData);
            await updateApiLog(this.Models, params.id,api_logs.id, result,response.message)
            return res.send(result);

        }catch(error){
            let response = {
                status: 0,
                message: CUSTOM_MESSAGES.ERROR,
                code: RESPONSE_CODES.SERVER_ERROR,
                error: error.message
            }
            await updateApiLog(this.Models, params.id, api_logs.id, response, error.message)
            return res.json(response)
        }
    }
    /**  customer list */
    async customerList(req,res){
        try{
            const {body} = req;
            let result = await this.services.customerList(body);
            return res.send(result);
        }
    catch(error){
        return res.json({
            status:0,
            message: CUSTOM_MESSAGES.ERROR,
            code: RESPONSE_CODES.SERVER_ERROR,
            error: error.message
        })
    }


    }
}