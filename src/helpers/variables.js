
export const accessDetails = (role_id) => {
    const data = {
        adminstrator: (role_id == 1) ? 1 : 0,

        agency_add: (role_id == 1) ? 1 : 0,
        agency_edit: (role_id == 1) ? 1 : 0,
        agency_list: (role_id == 1) ? 1 : 0,
        agency_delete: (role_id == 1) ? 1 : 0,

        broker_add: (role_id == 1) ? 1 : 0,
        broker_edit: (role_id == 1) ? 1 : 0,
        broker_list: (role_id == 1) ? 1 : 0,
        broker_delete: (role_id == 1) ? 1 : 0,

        quotes: (role_id == 1) ? 1 : 1,
        quotes_add: (role_id == 1) ? 1 : 1,
        quotes_edit: (role_id == 1) ? 1 : 1,
        quotes_list: (role_id == 1) ? 1 : 1,
        quotes_delete: (role_id == 1) ? 1 : 1,

        proposal: (role_id == 1) ? 1 : 1,
        proposal_add: (role_id == 1) ? 1 : 1,
        proposal_edit: (role_id == 1) ? 1 : 1,
        proposal_list: (role_id == 1) ? 1 : 1,
        proposal_delete: (role_id == 1) ? 1 : 1,

        finance: (role_id == 1) ? 1 : 1,
        finance_add: (role_id == 1) ? 1 : 1,
        finance_edit: (role_id == 1) ? 1 : 1,
        finance_list: (role_id == 1) ? 1 : 1,
        finance_delete: (role_id == 1) ? 1 : 1,

        customer: (role_id == 1) ? 1 : 0,
        customer_add: (role_id == 1) ? 1 : 0,
        customer_edit: (role_id == 1) ? 1 : 0,
        customer_list: (role_id == 1) ? 1 : 0,
        customer_delete: (role_id == 1) ? 1 : 0,
        
        post: (role_id == 1) ? 1 : 0,
        post_add: (role_id == 1) ? 1 : 0,
        post_edit: (role_id == 1) ? 1 : 0,
        post_list: (role_id == 1) ? 1 : 1,
        post_delete: (role_id == 1) ? 1 : 0,
    }
    return data
};

export const brokerUserAccessDetails = (details) => {
    const data = {
        adminstrator: (details.adminstrator == 1) ? 1 : 0,

        quotes: ((details.adminstrator == 1) || (details.quotes == 1)) ? 1 : 0,
        quotes_add: ((details.adminstrator == 1) || (details.quotes == 1)) ? 1 : 0,
        quotes_edit: ((details.adminstrator == 1) || (details.quotes == 1)) ? 1 : 0,
        quotes_list: ((details.adminstrator == 1) || (details.quotes == 1)) ? 1 : 0,
        quotes_delete: ((details.adminstrator == 1) || (details.quotes == 1)) ? 1 : 0,

        proposal: ((details.adminstrator == 1) || (details.proposal == 1)) ? 1 : 0,
        proposal_add: ((details.adminstrator == 1) || (details.proposal == 1)) ? 1 : 0,
        proposal_edit: ((details.adminstrator == 1) || (details.proposal == 1)) ? 1 : 0,
        proposal_list: ((details.adminstrator == 1) || (details.proposal == 1)) ? 1 : 0,
        proposal_delete: ((details.adminstrator == 1) || (details.proposal == 1)) ? 1 : 0,

        finance: ((details.adminstrator == 1) || (details.finance == 1)) ? 1 : 0,
        finance_add: ((details.adminstrator == 1) || (details.finance == 1)) ? 1 : 0,
        finance_edit: ((details.adminstrator == 1) || (details.finance == 1)) ? 1 : 0,
        finance_list: ((details.adminstrator == 1) || (details.finance == 1)) ? 1 : 0,
        finance_delete: ((details.adminstrator == 1) || (details.finance == 1)) ? 1 : 0,


        customer: ((details.adminstrator == 1) || (details.customer == 1)) ? 1 : 0,
        customer_add: ((details.adminstrator == 1) || (details.customer == 1)) ? 1 : 0,
        customer_edit: ((details.adminstrator == 1) || (details.customer == 1)) ? 1 : 0,
        customer_list: ((details.adminstrator == 1) || (details.customer == 1)) ? 1 : 0,
        customer_delete: ((details.adminstrator == 1) || (details.customer == 1)) ? 1 : 0,



        post: ((details.adminstrator == 1) || (details.post == 1)) ? 1 : 0,
        post_add: ((details.adminstrator == 1) || (details.post == 1)) ? 1 : 0,
        post_edit: ((details.adminstrator == 1) || (details.post == 1)) ? 1 : 0,
        post_list: ((details.adminstrator == 1) || (details.post == 1)) ? 1 : 0,
        post_delete: ((details.adminstrator == 1) || (details.post == 1)) ? 1 : 0,
    }
    return data;

}
