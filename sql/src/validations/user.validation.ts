import Joi from 'joi';

export const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional().allow(null, ''),
    status: Joi.boolean().optional(),
});
