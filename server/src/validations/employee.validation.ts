import Joi from 'joi';

export const createEmployeeSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  position: Joi.string().required(),
  department: Joi.string().required()
});

export const updateEmployeeSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  position: Joi.string(),
  department: Joi.string()
}).min(1);