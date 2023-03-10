const router = require('express').Router()
const db = require('../db')
const {validateLogin}=require('../middlewares/validation')
const authController=require('../controllers/login')

  // UPDATE
  router.post('/login',validateLogin, authController.login)
  
module.exports=router