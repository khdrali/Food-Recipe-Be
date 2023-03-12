const { parameters } = require("../db");
const db = require("../db");

//getRecipeByName
const getRecipeByName = async (params) => {
  const { type } = params;
  return await db`SELECT * FROM recipe ${
    type ? db`ORDER BY title DESC` : db`ORDER BY title ASC`
  }`;
};
//const {title, type, limit, page } = params
// return await db`SELECT * FROM recipe ${
//     type ? db`ORDER BY ${db(title)} DESC` : db`ORDER BY ${db(title)} ASC`}
//     LIMIT ${limit} OFFSET ${limit * (page - 1)}`

const getRecipePagination = async (params) => {
  const { limit, page } = params;
  return await db`SELECT * FROM recipe LIMIT ${limit} OFFSET ${
    limit * (page - 1)
  }`;
};

const getAllRecipes = async (params) => {
  return await db`SELECT * FROM recipe`;
};

const createRecipe = async (params) => {
  const { photo, title, ingredients, video } = params;
  return await db`
    INSERT INTO recipe ( photo,title, ingredients, video) 
    VALUES (${photo},${title}, ${ingredients}, ${video} )
  `;
};

const recipeById = async (params) => {
  const { id } = params;
  return await db`SELECT * FROM recipe WHERE id = ${id}`;
};

const updateRecipe = async (params) => {
  const { photo, title, ingredients, video, getRecipe, id } = params;
  return await db`
    UPDATE recipe SET
      "photo" = ${photo || getRecipe?.photo},
      "title" = ${title || getRecipe?.title},
      "ingredients" = ${ingredients || getRecipe?.ingredients},
      "video" = ${video || getRecipe?.video}
    WHERE "id" = ${id};
  `;
};

const deleteRecipe = async (params) => {
  const { id } = params;
  return await db`DELETE FROM "public"."recipe" WHERE "id" = ${id}`;
};

const searchRecipeName = async (params) => {
  const { name, limit, page } = params;
  return await db`SELECT * FROM recipe WHERE title ILIKE ${"%" + name + "%"} 
    LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
};

const searchRecipe = async (params) => {
  const { name } = params;
  return await db`SELECT * FROM recipe WHERE title ILIKE ${"%" + name + "%"}`;
};

module.exports = {
  getRecipeByName,
  getRecipePagination,
  getAllRecipes,
  createRecipe,
  recipeById,
  updateRecipe,
  deleteRecipe,
  searchRecipeName,
  searchRecipe,
};
