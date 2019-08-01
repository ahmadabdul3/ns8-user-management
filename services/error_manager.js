import {
  isSequelizeError,
  makeErrorsFriendly,
} from 'src/services/sequelize_error_transformer';

const FORM_VALIDATION_ERROR_NAME = 'error-form-validation';
const LOGIN_ERROR_NAME = 'error-login';
const SIGNUP_ERROR_NAME = 'error-signup';
const ERROR_NAME_INTERNAL_SERVER = 'internal-server-error';
const ERROR_NAME__MISSING_REQUIRED_PARAM = 'missing-required-param';

export function createError({ httpStatus, name, message, friendlyMessage }) {
  return {
    httpStatus: httpStatus || 500,
    name,
    message: message || 'There was an error',
    friendlyMessage,
  };
}

export function createErrorFormValidation({ message, friendlyMessage }) {
  const name = FORM_VALIDATION_ERROR_NAME;
  return createError({ name, message, friendlyMessage });
}

export function createErrorLogin({ message, friendlyMessage }) {
  const name = LOGIN_ERROR_NAME;
  return createError({ name, message, friendlyMessage });
}

export function createErrorSignup({ message, friendlyMessage }) {
  const name = SIGNUP_ERROR_NAME;
  return createError({ name, message, friendlyMessage });
}

export function createErrorInternalServer() {
  const name = ERROR_NAME_INTERNAL_SERVER;
  const message = 'Internal server error';
  const friendlyMessage = 'Oops, there was an error! This is our fault, not yours.'
    + ' If you keep running into problems please email us at ...';
  return createError({ httpStatus: 500, name, message, friendlyMessage });
}

export function errorHasFriendlyMessage({ error }) {
  return error.friendlyMessage;
}

export function emailAlreadyInUseError() {
  return createErrorSignup({
    message: 'Email already in use',
    friendlyMessage: `We're sorry, but the email you selected is being used by another account, please try a different one.`,
  });
}

export function missingRequiredParamError(options) {
  const friendlyMessage = options && options.friendlyMessage;
  return createError({
    httpStatus: 422,
    name: ERROR_NAME__MISSING_REQUIRED_PARAM,
    message: 'A required param for this endpoint is missing',
    friendlyMessage: friendlyMessage || 'A required param for this endpoint is missing',
  });
}

export function determineFriendlyMessage(error) {
  if (isSequelizeError(error)) return makeErrorsFriendly(error).message;
  else if (error.friendlyMessage) return error.friendlyMessage;
  else return `We're sorry, but there was an error. Please try again.`;
}
