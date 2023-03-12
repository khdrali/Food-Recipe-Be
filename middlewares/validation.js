const { Validator, addCustomMessages } = require("node-input-validator");

const validateCreate = (req, res, next) => {
  addCustomMessages({
    "username.required": "username wajib diisi",
    "username.min.length": "username terlalu pendek",
    "email.required": "email harus diisi",
    "email.minLength": "email harus lebih dari 5 huruf",
    "email.email": "email yang anda masukkan salah",
    "phone.required": "nomor handphone harus diisi",
    "phone.phoneNumber": "nomor handphone harus angka",
    "password.required": "password harus diisi",
    "password.minLength": "password minimal 8 huruf",
    "password.regex": "Password Harus Berisi Angka dan Huruf",
  });

  const rules = new Validator(req.body, {
    username: "required|minLength:3|maxLength:50",
    email: "required|minLength:5|email",
    phone: "required|minLength:7|maxLength:15|phoneNumber",
    password: "required|minLength:8|regex:[0-9]",
  });

  rules.check().then(function (matched) {
    if (matched) {
      next();
    } else {
      res.status(400).json({
        status: false,
        message: rules.errors,
        data: [],
      });
    }
  });
};

const validateCreateRecipe = (req, res, next) => {
  addCustomMessages({
    "title.required": "title wajib diisi",
    "title.min.length": "title terlalu pendek",
    "ingredients.required": "ingredients harus diisi",
    "ingredients.minLength": "ingredients terlalu pendek",
  });

  const rules = new Validator(req.body, {
    title: "required|minLength:1|maxLength:50",
    ingredients: "required|minLength:5",
  });

  rules.check().then(function (matched) {
    if (matched) {
      next();
    } else {
      res.status(400).json({
        status: false,
        message: rules.errors,
        data: [],
      });
    }
  });
};

const validateLogin = (req, res, next) => {
  const rules = new Validator(req.body, {
    email: "required|email",
    password: "required",
  });
  rules.check().then(function (success) {
    if (success) {
      next();
    } else {
      res.status(400).json({
        status: false,
        message: rules.errors,
        data: [],
      });
    }
  });
};
module.exports = { validateCreate, validateCreateRecipe, validateLogin };
