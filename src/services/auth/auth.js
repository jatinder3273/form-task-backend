import Logger from '../../helpers/logger';
import { RESPONSE_CODES } from '../../../config/constants';
import { CUSTOM_MESSAGES } from '../../../config/customMessages';
import { successResponse, errorResponse } from '../../../config/responseHelper';
import { refreshToken } from '../../helpers/jwt';
import bcrypt from 'bcrypt';
import { verifyToken } from '../../helpers/jwt';
import { emailValidation, sendMail } from '../../helpers/commonFunctions';
import { accessDetails } from '../../helpers/variables';

export default class Auth {
    async init(db) {
        this.logger = new Logger();
        await this.logger.init();
        this.Models = db.models;
    }

    /***  register new user  ***/
    async userRegistration(details) {
        try {
            const varifirdEmailData = await emailValidation(details.contact_email);
            if (varifirdEmailData != true) {
                return varifirdEmailData;
            };

            const checkUserEmail = await this.Models.Users.findOne({
                where: {
                    contact_email: details.contact_email,
                    is_deleted: 0
                }
            });
            if (checkUserEmail) {
                return errorResponse(CUSTOM_MESSAGES.EMAIL_EXIST, null, RESPONSE_CODES.POST)
            };

            if (details.exist_in_insurance_company == true){
                
                const password = Math.random().toString(36).substring(5);
                const send_to = details.contact_email;
                const mail_subject = 'Conta criada.';
                const message = `<div><h3> Sua conta Chubb foi criada com sucesso para a função de administrador. </h3><p> Guarde esta senha para referência futura. </p>
                            <strong>ENDEREÇO ​​DE E-MAIL :  </strong>  ${details.contact_email} <br><strong>SENHA :  </strong> ${password} </div>`;
                sendMail(send_to, mail_subject, message);
                details.password = password;
                details.status = 2
            }

            const userDetails = await this.Models.Users.create(details, { raw: true });
            const userData = await this.Models.Users.findOne(
                {where: { id: userDetails.id },
                attributes: { exclude: ['password'] }
            })
            if (details.user_docs && details.user_docs.length > 0) {
                for (let ele of details.user_docs) {
                    ele.user_id = userDetails.id;
                }
            }
            return successResponse(CUSTOM_MESSAGES.USER_REGISTER_SUCESS, userData, RESPONSE_CODES.POST)
            
        } catch (error) {
            this.logger.logError('User Registration Error: ', error);
            throw error;
        }
    }

    /***  user login  ***/
    async login(details) {
        try {
            let response = {};
            let varifirdEmailData = await emailValidation(details.email);
            if (varifirdEmailData != true) {
                return varifirdEmailData;
            };

            const user = await this.Models.Users.findOne({
                where: {
                    contact_email: details.email,
                    is_deleted: 0
                },
                include: [{
                    model: this.Models.User_access
                }],
                nest: true,
                raw: true
            })
            if (!user) {
                response.status = 0;
                response.code = RESPONSE_CODES.POST;
                response.message = CUSTOM_MESSAGES.USER_EMAIL_NOT_FOUND;
                response.data = null;
                return response;
            }

            if (user.status == 1) {
                response.status = 0;
                response.code = RESPONSE_CODES.POST;
                response.message = CUSTOM_MESSAGES.USER_APPROVAL_PENDING;
                response.data = null;
                return response;
            }

            if (user.status == 3) {
                response.status = 0;
                response.code = RESPONSE_CODES.POST;
                response.message = CUSTOM_MESSAGES.USER_INACTIVE;
                response.data = null;
                return response;
            }

            if (user.status == 4) {
                response.status = 0;
                response.code = RESPONSE_CODES.POST;
                response.message = CUSTOM_MESSAGES.USER_APPROVAL_REJECTED;
                response.data = null;
                return response;
            }

            let passwordMatch = await bcrypt.compare(details.password, user.password);

            if (!passwordMatch) {
                response.status = 0;
                response.code = RESPONSE_CODES.POST;
                response.message = CUSTOM_MESSAGES.INCORRECT_PASSWORD;
                response.data = null;
                return response;
            }

            const { id, role_id, contact_email } = user;
            let token = refreshToken({
                user_id: id,
                role_id: role_id,
                contact_email: contact_email
            });

            let last_login = new Date();
            await this.Models.Users.update({ last_login: last_login }, { where: { id: user.id } })
            let userDetails = await this.Models.Users.findOne({
                where: {
                    contact_email: details.email,
                    is_deleted: 0
                },
                include: [{
                    model: this.Models.User_access
                }],
                nest: true,
                raw: true
            })
            if(user.role_id ==1 || user.role_id ==2){
                let accessValues = accessDetails(user.role_id);
                await this.Models.User_access.update(accessValues,{where:{user_id:userDetails.id}});
            }
           
            delete userDetails.password;
            response.status = 1;
            response.code = RESPONSE_CODES.POST;
            response.message = CUSTOM_MESSAGES.LOGIN_SUCCESS;
            response.token = token;
            response.data = userDetails;
            return response;
        } catch (error) {
            this.logger.logError('User Login Error: ', error);
            throw error;
        }
    }

    /***  update user password  ***/
    async updatePassword(userData, details) {
        try {
            let response = {};

            let passwordMatch = await bcrypt.compare(details.old_password, userData.password);
            if (!passwordMatch) {
                response.status = 0;
                response.code = RESPONSE_CODES.PUT;
                response.message = CUSTOM_MESSAGES.INCORRECT_PASSWORD;
                response.data = null;
                return response;
            }

            await this.Models.Users.update({ password: details.new_password }, { where: { id: userData.id } });

            response.status = 1;
            response.code = RESPONSE_CODES.PUT;
            response.message = CUSTOM_MESSAGES.UPDATE_PASSWORD_SUCCESS;
            return response;
        } catch (error) {
            this.logger.logError('Update Password Error: ', error);
            throw error;
        }
    }

    /***  forgot password  ***/
    async forgotPassword(details) {
        try {
            let response = {};
            let varifirdEmailData = await emailValidation(details.email);
            if (varifirdEmailData !== true) {
                return varifirdEmailData;
            };
            const user = await this.Models.Users.findOne({ where: { contact_email: details.email, is_deleted: 0 }, raw: true });

            if (!user) {
                response.status = 0;
                response.code = RESPONSE_CODES.PUT;
                response.message = CUSTOM_MESSAGES.USER_EMAIL_NOT_FOUND;
                response.data = null;
                return response;
            };

            if (user.status != 2) {
                response.status = 0;
                response.code = RESPONSE_CODES.PUT;
                response.message = CUSTOM_MESSAGES.LOGIN_DENIED;
                response.data = null;
                return response;
            }

            const { id, contact_email, password } = user;
            let token = refreshToken({
                user_id: id,
                contact_email: contact_email,
                password: password
            })
            const baseUrl = process.env.FRONT_END_BASE_URL;
            const forgotPasswordLink = baseUrl + 'reset-password/' + token;
            console.log("*********** forgotPasswordLink ********** : ", forgotPasswordLink);

            /****  send forgot password link in email through sendgrid ***/
            let send_to = details.email;
            let mail_subject = 'Esqueci o link da senha';
            let message = `<h3> Link para redefinir sua senha. </h3><p> Clique neste link para criar uma nova senha. Ignore este e-mail se você não o solicitou. </p>
                            <a href=${forgotPasswordLink}><b>Clique aqui</b></a> para redefinir sua senha.`;
            sendMail(send_to, mail_subject, message);

            response.status = 1;
            response.code = RESPONSE_CODES.PUT;
            response.message = CUSTOM_MESSAGES.FORGOT_PASSWORD_LINK;
            return response;
        } catch (error) {
            this.logger.logError('Forgot Password Error: ', error);
            throw error;
        }
    }

    /***  reset password  ***/
    async resetPassword(details, params) {
        try {
            let response = {};
            let decoded = verifyToken(params.token);
            if (decoded === "jwt expired") {
                response.status = 0;
                response.code = RESPONSE_CODES.PUT;
                response.message = CUSTOM_MESSAGES.LINK_EXPIRED;
                return response;
            }

            let user = await this.Models.Users.findOne({ where: { password: decoded.password, contact_email: decoded.contact_email, is_deleted: 0 }, raw: true });

            if (!user) {
                response.status = 0;
                response.code = RESPONSE_CODES.PUT;
                response.message = CUSTOM_MESSAGES.LINK_EXPIRED;
                response.data = null;
                return response;
            }

            await this.Models.Users.update({ password: details.password }, { where: { id: user.id } });

            response.status = 1;
            response.code = RESPONSE_CODES.PUT;
            response.message = CUSTOM_MESSAGES.RESET_PASSWORD_SUCCESS;
            return response;

        } catch (error) {
            this.logger.logError('Reset Password Error: ', error);
            throw error;
        }
    }


}