const router = require('express').Router()
const db = require('../db')
const {validateCreate}=require('../middlewares/validation')
const {validateToken}=require('../middlewares/webtoken')
const userController=require('../controllers/users')
const {useRedis}=require('../middlewares/redis')

// READ
router.get('/:id?',validateToken , useRedis, userController.getUser)  
// UPDATE
router.patch('/update/data/:id' , userController.updateUsers)

  // CREATE
  router.post('/add',validateCreate, userController.createUsers)
  
  
  // DELETE
  router.delete('/delete/:id',validateToken, userController.deleteUsers)
  
module.exports=router