import Joi from 'joi';

module.exports = {
    updateUserValidator: Joi.object().keys({
        role_id: Joi.number().allow(null, ''),
        cnpj: Joi.string().min(14).max(20).allow(null, ''),
        company_name: Joi.string().max(100).allow(null, ''),
        address: Joi.string().max(150).allow(null, ''),
        address_number: Joi.string().max(50).allow(null, ''),
        address_add_info: Joi.string().max(100).allow(null, ''),
        zip_code: Joi.number().allow(null, ''),
        district: Joi.string().max(20).allow(null, ''),
        city_state: Joi.string().max(15).allow(null, ''),
        state: Joi.string().allow(null, ''),
        company_reg_number: Joi.number().max(2147483647).error(() => '"\company_reg_number\" required and must be less than or equal to 9').allow(null, ''),
        foundation_date: Joi.date().raw().allow(null,''),
        is_legal_representative: Joi.number().allow(null, ''),
        contact_name: Joi.string().max(50).allow(null, ''),
        last_name: Joi.string().allow(null,''),
        contact_cpf: Joi.string().max(15).allow(null, ''),

        contact_email: Joi.string().email().max(50).allow(null, ''),
        phone_number: Joi.string().max(15).allow(null, ''),
        password: Joi.string().allow(null,''),
        is_pj_account_registered: Joi.number().allow(null, ''),
        bank_name: Joi.string().max(50).allow(null, ''),
        agency_number: Joi.number().max(9223372036854776000).error(() => '"\agency_number\" must be less than or equal to 16').allow(null, ''),

        account_number: Joi.number().max(9223372036854776000).error(() => '"\account_number\" must be less than or equal to 16').allow(null, ''),
        is_terms_accepted: Joi.number().allow(null, ''),
        is_terms_accepted: Joi.number().allow(null, ''),
        type: Joi.string().allow(null, ''),
        adminstrator: Joi.number().allow(null, ''),
        quotes: Joi.number().allow(null, ''),
        proposal: Joi.number().allow(null, ''),
        claim: Joi.number().allow(null, ''),
        finance: Joi.number().allow(null, '')
    }),

    updateUserAccess: Joi.object().keys({
        user_id: Joi.number().required(),
        quotes: Joi.number().allow(null, ''),
        quotes_add: Joi.number().allow(null, ''),
        quotes_edit: Joi.number().allow(null, ''),
        quotes_list: Joi.number().allow(null, ''),
        quotes_delete: Joi.number().allow(null, ''),
        proposal: Joi.number().allow(null, ''),
        proposal_add: Joi.number().allow(null, ''),
        proposal_edit: Joi.number().allow(null, ''),
        proposal_list: Joi.number().allow(null, ''),
        proposal_delete: Joi.number().allow(null, ''),
        claim: Joi.number().allow(null, ''),
        claim_add: Joi.number().allow(null, ''),
        claim_edit: Joi.number().allow(null, ''),
        claim_list: Joi.number().allow(null, ''),
        claim_delete: Joi.number().allow(null, ''),
        finance: Joi.number().allow(null, ''),
        finance_add: Joi.number().allow(null, ''),
        finance_edit: Joi.number().allow(null, ''),
        finance_list: Joi.number().allow(null, ''),
        finance_delete: Joi.number().allow(null, ''),

    })
}