import Joi from 'joi';

export const teamQuerySchema = Joi.object({
  department: Joi.string(),
  status: Joi.string().valid('active', 'inactive'),
  minRisk: Joi.number().min(0).max(100),
  maxRisk: Joi.number().min(0).max(100)
});

export const teamCreateSchema = Joi.object({
  name: Joi.string().required(),
  department: Joi.string().required(),
  managerId: Joi.string().hex().length(24).required(),
  memberIds: Joi.array().items(Joi.string().hex().length(24)).required(),
  status: Joi.string().valid('active', 'inactive').default('active')
});