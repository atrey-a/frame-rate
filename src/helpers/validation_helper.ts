//Validation
import Joi from "joi";

//RegisterValidation
export const registerValidation = (data) => {
  const Schema = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(8).max(1024).required(),
  });
  return Schema.validate(data);
};

export const loginValidation = (data) => {
  const Schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().required(),
  });
  return Schema.validate(data);
};
