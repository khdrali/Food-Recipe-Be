const recipe = require("../models/recipe");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { cloudinary } = require("../helper");

const getRecipes = async (req, res) => {
  try {
    const { type } = req.query;
    if (type) {
      const getSelectedRecipe = await recipe.getRecipeByName({ type });
      res.status(200).json({
        status: true,
        message: "data berhasil di tampilkan",
        count: getSelectedRecipe?.length,
        data: getSelectedRecipe,
      });
    } else {
      const getAllRecipe = await recipe.getAllRecipes();
      res.status(200).json({
        status: true,
        message: "data berhasil di tampilkan",
        count: getAllRecipe?.length,
        data: getAllRecipe,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const recipeById = await recipe.recipeById({ id });
      res.status(200).json({
        status: true,
        message: "data berhasil di tampilkan",
        data: recipeById,
      });
    } else {
      const getAllRecipe = await recipe.getAllRecipes();
      res.status(200).json({
        status: true,
        message: "data berhasil di tampilkan",
        count: getAllRecipe?.length,
        data: getAllRecipe,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

const getRecipePagination = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const getAllRecipe = await recipe.getRecipePagination({ limit, page });
    if (getAllRecipe.length > 0) {
      res.status(200).json({
        status: true,
        message: "data berhasil di tampilkan",
        count: getAllRecipe?.length,
        data: getAllRecipe,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

const createRecipes = async (req, res) => {
  try {
    const { title, ingredients, video } = req.body;
    let file = req.files.photo;

    if (!file) {
      throw "Photo tidak boleh kosong";
    }
    // let fileName = `${uuidv4()}-${file.name}`
    // let uploadPath = `${path.dirname(require.main.filename)}/public/${fileName}`
    let mimeType = file.mimetype.split("/")[1];
    let allowFile = ["jpeg", "jpg", "png", "webp"];

    // validate size image
    if (file.size > 1048576) {
      throw "File terlalu besar, max 1mb";
    }

    if (allowFile.find((item) => item === mimeType)) {
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { public_id: uuidv4() },
        async (error, result) => {
          if (error) {
            throw "Upload foto gagal";
          }

          const addRecipe = await recipe.createRecipe({
            photo: result?.url,
            title,
            ingredients,
            video,
          });

          res.json({
            status: true,
            message: "berhasil di tambah",
            data: addRecipe,
          });
        }
      );
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};
const updateRecipes = async (req, res) => {
  try {
    const { id } = req.params;
    const { photo, title, ingredients, video } = req.body;
    const getRecipe = await recipe.recipeById({ id });
    if (!getRecipe) {
      throw "Recipe Tidak Terdaftar";
    }

    let file = req.files?.photo;
    let fileName;
    if (file) {
      fileName = `${uuidv4()}-${file.name}`;
      let uploadPath = `${path.dirname(
        require.main.filename
      )}/public/${fileName}`;
      let mimeType = file.mimetype.split("/")[1];
      let allowFile = ["jpeg", "jpg", "png"];

      if (file.size > 1048576) {
        throw "File terlalu besar, max 1mb";
      }

      if (allowFile.find((item) => item === mimeType)) {
        file.mv(uploadPath, async function (err) {
          if (err) throw "Upload photo gagal";
        });
      }
    }
    if (getRecipe) {
      await recipe.updateRecipe({
        photo: fileName ? `/images/${fileName}` : null,
        title: !title || title === "" ? getRecipe[0].title : title,
        ingredients:
          !ingredients || ingredients === ""
            ? getRecipe[0].ingredients
            : ingredients,
        getRecipe: getRecipe[0],
        video: !video || video === "" ? getRecipe[0].video : video,
        id,
      });
    } else {
      throw "ID Tidak terdaftar";
    }
    res.json({
      status: true,
      message: "berhasil di ubah",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};
const deleteRecipes = async (req, res) => {
  try {
    const { id } = req.params;

    const checkDuplicateId = await recipe.recipeById({ id });
    if (checkDuplicateId <= 0) {
      throw { code: 400, message: "id tidak ditemukkan" };
    }

    await recipe.deleteRecipe({ id });

    res.json({
      status: true,
      message: "berhasil di hapus",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};
const searchRecipes = async (req, res) => {
  try {
    const { name, limit, page } = req.query;

    if (name) {
      const getSelectedRecipe = await recipe.searchRecipeName({
        name,
        limit,
        page,
      });
      res.status(200).json({
        status: true,
        message: "data berhasil di tampilkan",
        count: getSelectedRecipe?.length,
        data: getSelectedRecipe,
      });
    } else if (name) {
      const getSelectedRecipe = await recipe.searchRecipe({ name });
      res.status(200).json({
        status: true,
        message: "data berhasil di tampilkan",
        count: getSelectedRecipe?.length,
        data: getSelectedRecipe,
      });
    } else {
      const getAllRecipe = await recipe.getAllRecipes();
      res.status(200).json({
        status: true,
        message: "data berhasil ditampilkan",
        data: getAllRecipe,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};
module.exports = {
  getRecipes,
  createRecipes,
  updateRecipes,
  deleteRecipes,
  searchRecipes,
  getRecipePagination,
  getRecipeById,
};
