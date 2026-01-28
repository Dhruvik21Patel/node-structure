import Joi from 'joi';

export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().optional().allow(null, ''),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
