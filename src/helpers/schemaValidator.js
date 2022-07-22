import Joi from "joi";
import { RESPONSE_CODES } from '../../config/constants'
module.exports = schemaValidator

export const validator = (data, schema) => {
  const schemaValidation = Joi.validate(data, schema, { abortEarly: false });
  const errorMessages = [];
  if (schemaValidation.error) {
    if (schemaValidation.error.details) {
      schemaValidation.error.details.forEach((err) => {
        errorMessages.push(err.message);
      });
    }
  }

  if (errorMessages.length > 0) {
    return {
      isError: true,
      errors: errorMessages,
    };
  }

  return {
    isError: false,
    errors: errorMessages,
  };
};

function schemaValidator(schema) {
  /** schema for check validation */
  return [
    async (req, res, next) => {
      const { body } = req
    /** Validate Joi schema */
      let { isError, errors } = validator(body, schema);
      if (isError) {
        return res.status(RESPONSE_CODES.BAD_REQUEST).json({
          status: 0,
          message: errors[0],
          code: RESPONSE_CODES.POST
        });
      }
      next()
    }
  ]
}
