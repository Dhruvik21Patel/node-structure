import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const validate =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // ✅ collect all errors
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const validationError: Record<string, string[]> = {};

      error.details.forEach((detail) => {
        const key = detail.path.join(".");

        if (!validationError[key]) {
          validationError[key] = [];
        }

        validationError[key].push(detail.message.replace(/"/g, ""));
      });

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        validationError,
        data: null,
      });
    }

    // sanitized body
    req.body = value;
    next();
  };

export default validate;
