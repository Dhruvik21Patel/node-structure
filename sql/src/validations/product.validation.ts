import Joi from 'joi';

export const createProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional().allow(null, ''),
    price: Joi.number().positive().required(),
    categoryId: Joi.string().required(),
});

export const updateProductSchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional().allow(null, ''),
    price: Joi.number().positive().optional(),
    categoryId: Joi.string().optional(),
});