import Joi from "joi";

module.exports = {
  taskValidator: Joi.object().keys({
    created_by: Joi.string().min(1).max(100).required(),
    due_date: Joi.string(),
    client: Joi.string().min(1).max(100).required(),
    project: Joi.string().min(1).max(100).required(),
    task: Joi.string().min(1).max(100).required(),
    status: Joi.number().allow(null, ""),
    assignee: Joi.string().min(1).max(100).required(),
    is_send_email: Joi.number().allow(null, ""),
    project_date_filter: Joi.number().allow(null, ""),
    task_type: Joi.string().min(1).max(100).required(),
    priority: Joi.string().min(1).max(100).required(),
    notes: Joi.string().required(),
    email_notes: Joi.string().required(),
  }),
};
