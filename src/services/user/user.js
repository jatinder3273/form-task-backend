import Logger from '../../helpers/logger';
import { RESPONSE_CODES } from '../../../config/constants';
import { CUSTOM_MESSAGES } from '../../../config/customMessages';
import { brokerUserAccessDetails } from '../../helpers/variables';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

export default class User {
    async init(db) {
        this.logger = new Logger();
        await this.logger.init();
        this.Models = db.models;
    }

    /*** view pending and approved list of Broker ***/
    async getPendingApprovedUserList(details) {
        try {
            let response = {};
            let query = {};
            let start = details.start ? details.start : 0;
            let limit = details.length ? details.length : 10

            if (details.status == 0) {
                response.status = 0;
                response.code = RESPONSE_CODES.POST;
                response.message = CUSTOM_MESSAGES.INVALID_STATUS;
                response.data = [];
                return response;
            }
            if (details.search.value) {
                let searchValue = details.search.value.trim();
                query = {
                    status: details.status ? details.status : [1, 2, 3, 4],
                    is_deleted: 0,
                    role_id: 2,
                    [Op.or]: [
                        { id: { [Op.like]: '%' + searchValue + '%' } },
                        { contact_name: { [Op.like]: '%' + searchValue + '%' } },
                        { cnpj: { [Op.like]: '%' + searchValue + '%' } },
                        { contact_email: { [Op.like]: '%' + searchValue + '%' } }
                    ]
                }
            } else {
                query = {
                    status: details.status ? details.status : [1, 2, 3, 4],
                    role_id: 2,
                    is_deleted: 0
                }
            }
            let user_list = await this.Models.Users.findAll({
                where: query, attributes: { exclude: ['password'] },
                include: [{
                    model: this.Models.User_documents,
                    attributes: ['path', 'type', 'name']
                }],
                nest: true,
                offset: start, limit: limit, order: [['id', 'desc']]
            });
            let userCount = await this.Models.Users.count({ where: query });
            response.status = 1;
            response.code = RESPONSE_CODES.POST;
            response.message = CUSTOM_MESSAGES.USER_LIST;
            response.recordsTotal = userCount;
            response.recordsFiltered = userCount;
            response.data = user_list;
            return response;
        } catch (error) {
            this.logger.logError('View User List Error: ', error);
            throw error;
        }
    }

    /*** update user details by id ***/
    async updateUser(details, params, tokenData) {
        try {
            let response = {};
            if ((tokenData.role_id == 3) && (tokenData.id != params.id)) {
                response.status = 0;
                response.code = RESPONSE_CODES.UNAUTHORIZED;
                response.message = CUSTOM_MESSAGES.UNAUTHORIZED_USER;
                response.data = null;
                return response;
            }

            let userDetails = await this.Models.Users.findOne({ where: { id: params.id }, raw: true })

            if (!userDetails) {
                response.status = 0;
                response.code = RESPONSE_CODES.PUT;
                response.message = CUSTOM_MESSAGES.USER_NOT_FOUND;
                response.data = null;
                return response;
            }

            if ((tokenData.role_id == 2) && (userDetails.role_id == 1)) {
                response.status = 0;
                response.code = RESPONSE_CODES.UNAUTHORIZED;
                response.message = CUSTOM_MESSAGES.UNAUTHORIZED_USER;
                response.data = null;
                return response;
            }

            if ((tokenData.role_id == 1) && (userDetails.role_id == 1) && (tokenData.id != userDetails.id)) {
                response.status = 0;
                response.code = RESPONSE_CODES.UNAUTHORIZED;
                response.message = CUSTOM_MESSAGES.UNAUTHORIZED_USER;
                response.data = null;
                return response;
            }

            if ((tokenData.role_id == 2) && (userDetails.role_id == 2) && (tokenData.id != userDetails.id)) {
                response.status = 0;
                response.code = RESPONSE_CODES.UNAUTHORIZED;
                response.message = CUSTOM_MESSAGES.UNAUTHORIZED_USER;
                response.data = null;
                return response;
            }

            if ((tokenData.role_id == 2) && userDetails.role_id == 3 && (userDetails.activated_by != tokenData.id)) {
                response.status = 0;
                response.code = RESPONSE_CODES.UNAUTHORIZED;
                response.message = CUSTOM_MESSAGES.UNAUTHORIZED_USER;
                response.data = null;
                return response;
            }

            let userByEmail = await this.Models.Users.findOne({ where: { contact_email: details.contact_email }, raw: true });

            if (!userByEmail) {
                response.status = 0;
                response.code = RESPONSE_CODES.PUT;
                response.message = CUSTOM_MESSAGES.USER_EMAIL_NOT_FOUND;
                response.data = null;
                return response;
            }

            if (userByEmail && (userByEmail.id != userDetails.id)) {
                response.status = 0;
                response.code = RESPONSE_CODES.PUT;
                response.message = CUSTOM_MESSAGES.EMAIL_EXIST;
                response.data = null;
                return response;
            };

            await this.Models.Users.update(details, { where: { id: params.id } })

            if ((tokenData.role_id == 2) && (userDetails.role_id == 3)) {
                let accessValues = brokerUserAccessDetails(details);
                accessValues.user_id = params.id;
                await this.Models.User_access.update(accessValues, { where: { user_id: params.id } })
            }

            let userUpdatedData = await this.Models.Users.findOne({
                where: { id: params.id },
                attributes: { exclude: ['password'] },
                include: [{
                    model: this.Models.User_documents,
                    attributes: ['path', 'type', 'name'],
                },
                {
                    model: this.Models.User_access

                }],
                nest: true,
                raw: true
            })

            response.status = 1;
            response.code = RESPONSE_CODES.PUT;
            response.message = CUSTOM_MESSAGES.USER_UPDATE_SUCCESS;
            response.data = userUpdatedData;
            return response;

        } catch (error) {
            this.logger.logError('Update user details by ID error: ', error);
            throw error;
        }
    };

    /*** get user profile details ***/
    async getUserProfile(details) {
        try {
            delete details.password;
            let response = {};
            let userDocuments = await this.Models.User_documents.findOne({ where: { user_id: details.id }, attributes: ['path', 'type', 'name'], raw: true });
            details.documents = userDocuments;

            response.status = 1;
            response.code = RESPONSE_CODES.GET;
            response.message = CUSTOM_MESSAGES.USER_PROFILE;
            response.data = details;
            return response;
        } catch (error) {
            this.logger.logError('View User Profile Error: ', error);
            throw error;
        }
    }

    /*** get user details by id ***/
    async getUserById(params, tokenData) {
        try {
            let response = {};

            if ((tokenData.role_id == 3) && (tokenData.id != params.id)) {
                response.status = 0;
                response.code = RESPONSE_CODES.UNAUTHORIZED;
                response.message = CUSTOM_MESSAGES.UNAUTHORIZED_USER;
                response.data = null;
                return response;
            }

            let userDetails = await this.Models.Users.findOne({
                where: { id: params.id },
                attributes: { exclude: ['password'] },
                include: [{
                    model: this.Models.User_documents,
                    attributes: ['path', 'type', 'name'],
                },
                {
                    model: this.Models.User_access

                }
                ],
                nest: true,
                raw: true
            });

            if (!userDetails) {
                response.status = 0;
                response.code = RESPONSE_CODES.GET;
                response.message = CUSTOM_MESSAGES.USER_NOT_FOUND;
                response.data = null;
                return response;
            }

            if ((tokenData.role_id == 2) && (userDetails.role_id == 1)) {
                response.status = 0;
                response.code = RESPONSE_CODES.UNAUTHORIZED;
                response.message = CUSTOM_MESSAGES.UNAUTHORIZED_USER;
                response.data = null;
                return response;
            }

            if ((tokenData.role_id == 1) && (userDetails.role_id == 1) && (tokenData.id != userDetails.id)) {
                response.status = 0;
                response.code = RESPONSE_CODES.UNAUTHORIZED;
                response.message = CUSTOM_MESSAGES.UNAUTHORIZED_USER;
                response.data = null;
                return response;
            }

            if ((tokenData.role_id == 2) && (userDetails.role_id == 2) && (tokenData.id != userDetails.id)) {
                response.status = 0;
                response.code = RESPONSE_CODES.UNAUTHORIZED;
                response.message = CUSTOM_MESSAGES.UNAUTHORIZED_USER;
                response.data = null;
                return response;
            }

            if (tokenData.role_id == 2 && userDetails.role_id == 3 && userDetails.activated_by != tokenData.id) {
                response.status = 0;
                response.code = RESPONSE_CODES.UNAUTHORIZED;
                response.message = CUSTOM_MESSAGES.UNAUTHORIZED_USER;
                response.data = null;
                return response;
            }

            response.status = 1;
            response.code = RESPONSE_CODES.GET;
            response.message = CUSTOM_MESSAGES.USER_PROFILE;
            response.data = userDetails;
            return response;

        } catch (error) {
            this.logger.logError('View User Details by ID Error: ', error);
            throw error;
        }
    }

    /***  list of broker user  ***/
    async userList(details, tokenData) {
        try {
            let response = {};
            let query = {};
            let start = details.start ? details.start : 0;
            let limit = details.length ? details.length : 10;

            if (details.search.value) {
                let searchValue = details.search.value.trim();
                query = {
                    status: details.status ? details.status : 2,
                    // role_id: 3,
                    is_deleted: 0,
                    [Op.or]: [
                        { id: { [Op.like]: '%' + searchValue + '%' } },
                        { cnpj: { [Op.like]: '%' + searchValue + '%' } },
                        { contact_email: { [Op.like]: '%' + searchValue + '%' } },
                        { district: { [Op.like]: '%' + searchValue + '%' } },
                    ]
                }
            } else {
                query = {
                    status: details.status ? details.status : 2,
                    // role_id: 3,
                    is_deleted: 0
                }
            }

            query.activated_by = tokenData.id
            let brokerUserList = await this.Models.Users.findAll({
                where: query,
                attributes: { exclude: ['password'] },
                include: [{
                    model: this.Models.User_documents,
                    attributes: ['path', 'type', 'name']
                }],
                nest: true,
                offset: start,
                limit: limit,
                order: [['id', 'desc']]
            });

            let totalBrokerUser = await this.Models.Users.count({ where: query });

            response.status = 1;
            response.code = RESPONSE_CODES.POST;
            response.message = CUSTOM_MESSAGES.USER_LIST;
            response.recordsTotal = totalBrokerUser;
            response.recordsFiltered = totalBrokerUser;
            response.data = brokerUserList;
            return response

        } catch (error) {
            this.logger.logError('List of broker user error!!', error);
            throw error;
        }
    }

    /***  update user access  ***/
    async updateUserAccess(details, tokenData) {
        try {
            let response = {};
            if (tokenData.id == details.user_id) {
                response.status = 0;
                response.code = RESPONSE_CODES.UNAUTHORIZED;
                response.message = CUSTOM_MESSAGES.UNAUTHORIZED_USER;
                response.data = null;
                return response;
            };

            await this.Models.User_access.update(details, { where: { user_id: details.user_id } });
            let userAccessDetails = await this.Models.User_access.findOne({
                where: { user_id: details.user_id },
                raw: true
            })

            response.status = 1;
            response.code = RESPONSE_CODES.GET;
            response.message = CUSTOM_MESSAGES.USER_ACCESS_UPDATED;
            response.data = userAccessDetails;
            return response;

        } catch (error) {
            this.logger.logError('Update user access error!!', error);
            throw error;
        }
    }

    /*** delete user by id ***/
    async deleteUser(params, tokenData) {
        try {
            let response = {};

            if (tokenData.id == params.id) {
                response.status = 0;
                response.code = RESPONSE_CODES.UNAUTHORIZED;
                response.message = CUSTOM_MESSAGES.UNAUTHORIZED_USER;
                response.data = null;
                return response
            }

            await this.Models.Users.destroy({ where: { id: params.id, is_deleted: 0 }, individualHooks: true })

            response.status = 1;
            response.code = RESPONSE_CODES.GET;
            response.message = CUSTOM_MESSAGES.USER_DELETE_SUCCESS;
            return response

        } catch (error) {
            this.logger.logError('Delete user by id error!!', error);
            throw error;
        }
    }

    /** customer list */
    async customerList(details) {
        try {
            let response = {};
            let query = {};
            let start = details.start ? details.start : 0;
            let limit = details.length ? details.length : 10;
            query = {
                role_id: 4,
                status: details.status ? details.status : [1,2,3,4],
            }
            if (details.search.value) {
                query[Op.or] = [
                    { id: { [Op.like]: '%' + details.search.value + '%' } },
                    { cnpj: { [Op.like]: '%' + details.search.value + '%' } },
                    { contact_email: { [Op.like]: '%' + details.search.value + '%' } },
                    { contact_name: { [Op.like]: '%' + details.search.value + '%' } },
                    { phone_number: { [Op.like]: '%' + details.search.value + '%' } },
                ]
            }
            let getCustomerList = await this.Models.Users.findAll({
                where: query,
                attributes: { exclude: ['password'] },
                nest: true,
                offset: start,
                limit: limit,
                order: [['id', 'desc']]
            });
            let total = await this.Models.Users.count({ where: query });
            if (!getCustomerList) {
                response.status = 0;
                response.code = RESPONSE_CODES.POST;
                response.message = CUSTOM_MESSAGES.USER_NOT_FOUND;
                response.recordsTotal = null,
                response.recordsFiltered = null
                return response;
            }
            response.status = 1;
            response.code = RESPONSE_CODES.POST;
            response.message = CUSTOM_MESSAGES.USER_LIST;
            response.recordsTotal = total,
            response.recordsFiltered = total,
            response.data = getCustomerList;
            response.recordsTotal = total,
            response.recordsFiltered = total
            return response;

        } catch (error) {
            this.logger.logError('User Customer List error!!', error);
            throw error;
        }
    }
}
