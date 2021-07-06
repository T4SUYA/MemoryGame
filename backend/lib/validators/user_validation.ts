import * as Joi from "@hapi/joi";

export function registerValidation(data: any) {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
}

export function loginValidation(data: any) {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
    name: Joi.string().optional(),
  });
  return schema.validate(data);
}
