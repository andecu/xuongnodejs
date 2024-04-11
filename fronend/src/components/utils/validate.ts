import Joi from "joi";
import * as yup from "yup";

export const productAddSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  image: Joi.required(),
  description: Joi.string(),
  discount: Joi.number(),
  featured: Joi.boolean(),
});

export const productUpdateSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  category: yup.string().required(),
  image: yup.mixed(),
  price: yup.string().required(),
  discount: yup.string().required(),
  featured: yup.boolean().required(),
});

export const checkoutValidate = yup.object({
  lastName: yup.string().required(),
  firstName: yup.string().required(),
  phone: yup.string().required(),
  company: yup.string().required(),
  country: yup.string().required(),
  address: yup.string().required(),
  city: yup.string().required(),
  province: yup.string().required(),
  zip_code: yup.string().required(),
  email: yup.string().required(),
  note: yup.string(),
});
