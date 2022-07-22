import Joi from 'joi';

module.exports = {

    registerValidator: Joi.object().keys({
        exist_in_insurance_company: Joi.boolean().allow(null, ''),
        role_id: Joi.number().required(),
        cnpj: Joi.string().min(14).max(20).required(),
        company_name: Joi.string().max(100).required(),
        address: Joi.string().max(150).required(),
        address_number: Joi.string().max(50).required(),
        address_add_info: Joi.string().max(100).allow(null, ''),
        district: Joi.string().max(20).allow(null, ''),
        city_state: Joi.string().max(15).required(),

        company_reg_number: Joi.number().max(2147483647).error(() => '"\company_reg_number\" required and must be less than or equal to 9').required(),
        is_legal_representative: Joi.number().required(),
        contact_name: Joi.string().max(50).required(),
        contact_cpf: Joi.string().min(11).max(15).allow(null, ''),
        contact_email: Joi.string().email().max(50).required(),
        phone_number: Joi.string().max(15).allow(null, ''),
        is_pj_account_registered: Joi.number().allow(null, ''),
        bank_name: Joi.string().max(50).allow(null, ''),

        agency_number: Joi.number().max(9223372036854776000).error(() => '"\agency_number\" must be less than or equal to 16').allow(null, ''),

        account_number: Joi.number().max(9223372036854776000).error(() => '"\account_number\" must be less than or equal to 16').allow(null, ''),
        is_terms_accepted: Joi.number().allow(null, ''),

        status: Joi.number().allow(null, ''),
        type: Joi.string().allow(null, ''),
        user_docs: Joi.array().allow(null, '')
    }),

    loginValidator: Joi.object().keys({
        email: Joi.string().email().max(50).required(),
        password: Joi.string().min(6).required(),
    }),

    updatePasswordValidator:Joi.object().keys({
        old_password: Joi.string().min(6).required(),
        new_password: Joi.string().min(6).required(),
    }),

    forgotPasswordValidator: Joi.object().keys({
        email: Joi.string().email().max(50).required(),
    }),

    resetPasswordValidator: Joi.object().keys({
        password: Joi.string().min(6).required(),
    }),

};