const joi = require("joi");

class AdminValidations {
  constructor() {}

  static register = async (req, res, next) => {
    try {
      await joi
        .object({
          name: joi.string().trim().min(3).max(35).required().messages({
            "string.base": "İsim Alanı metin olmalıdır.",
            "string.min": "İsim Alanı minimum 3 karakter olmalıdır.",
            "string.empty": "İsim Alanı boş olamaz.",
            "string.max": "İsim Alanı en fazla 35 karakter olabilir.",
            "any.required": "İsim Alanı zorunludur.",
          }),
          lastName: joi.string().trim().min(3).max(60).required().messages({
            "string.base": "Soyİsim Alanı metin olmalıdır.",
            "string.min": "Soyİsim Alanı minimum 3 karakter olmalıdır.",
            "string.empty": "Soyİsim Alanı boş olamaz.",
            "string.max": "Soyİsim Alanı en fazla 60 karakter olabilir.",
            "any.required": "Soyİsim Alanı zorunludur.",
          }),
          email: joi
            .string()
            .email()
            .trim()
            .min(3)
            .max(100)
            .required()
            .messages({
              "string.base": "Email Alanı metin olmalıdır.",
              "string.min": "Email Alanı minimum 3 karakter olmalıdır.",
              "string.empty": "Email Alanı boş olamaz.",
              "string.max": "Email Alanı en fazla 100 karakter olabilir.",
              "string.email": "Lütfen geçerli bir Email adresi giriniz.",
              "any.required": "Email Alanı zorunludur.",
            }),
          password: joi.string().trim().min(8).max(36).required().messages({
            "string.base": "Şifre Alanı metin olmalıdır.",
            "string.min": "Şifre Alanı minimum 8 karakter olmalıdır.",
            "string.empty": "Şifre Alanı boş olamaz.",
            "string.max": "Şifre Alanı en fazla 36 karakter olabilir.",
            "any.required": "Şifre Alanı zorunludur.",
          }),
        })
        .validateAsync(req.body);
      next();
    } catch (error) {
      res.status(400).json({ message: error.details[0].message });
    }
  };

  static login = async (req, res, next) => {
    try {
      await joi
        .object({
          email: joi
            .string()
            .email()
            .trim()
            .min(3)
            .max(100)
            .required()
            .messages({
              "string.base": "Email Alanı metin olmalıdır.",
              "string.min": "Email Alanı minimum 3 karakter olmalıdır.",
              "string.empty": "Email Alanı boş olamaz.",
              "string.max": "Email Alanı en fazla 100 karakter olabilir.",
              "string.email": "Lütfen geçerli bir Email adresi giriniz.",
              "any.required": "Email Alanı zorunludur.",
            }),
          password: joi.string().trim().min(8).max(36).required().messages({
            "string.base": "Şifre Alanı metin olmalıdır.",
            "string.min": "Şifre Alanı minimum 8 karakter olmalıdır.",
            "string.empty": "Şifre Alanı boş olamaz.",
            "string.max": "Şifre Alanı en fazla 36 karakter olabilir.",
            "any.required": "Şifre Alanı zorunludur.",
          }),
        })
        .validateAsync(req.body);
      next();
    } catch (error) {
      res.status(400).json({ message: error.details[0].message });
    }
  };
}

module.exports = AdminValidations;
