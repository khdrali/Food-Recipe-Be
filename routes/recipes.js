const router = require('express').Router()
const db = require('../db')
const {validateCreateRecipe}=require('../middlewares/validation')
const {validateToken}=require('../middlewares/webtoken')
const recipeController=require('../controllers/recipes')
  
  // READ RECIPE
  router.get('/data/sort/:id?',recipeController.getRecipes)
  
  // CREATE RECIPE
  router.post('/add',validateToken,validateCreateRecipe, recipeController.createRecipes)
  
  // UPDATE RECIPE
  router.patch('/edit/:id',validateToken, recipeController.updateRecipes)
  
  // DELETE RECIPE
  router.delete('/delete/:id',validateToken, recipeController.deleteRecipes)
  
  // SEARCH
  router.get('/data-sort/search', recipeController.searchRecipes)

  //PAGINATION
  router.get('/data/sort', recipeController.getRecipePagination)

  module.exports=router