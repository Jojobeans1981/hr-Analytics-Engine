import Joi from 'joi';

export const createAssessmentSchema = Joi.object({
  employeeId: Joi.string().hex().length(24).required(),
  skills: Joi.array().items(Joi.string()).min(1).required(),
  score: Joi.number().min(0).max(100).required(),
  notes: Joi.string().allow('').optional()
});

export const updateAssessmentSchema = Joi.object({
  skills: Joi.array().items(Joi.string()).min(1),
  score: Joi.number().min(0).max(100),
  notes: Joi.string().allow('')
}).min(1);