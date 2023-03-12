const account = require("../models/account");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();
const saltRounds = 10;
const { connect } = require("../middlewares/redis");
const { cloudinary } = require("../helper");
const { Console } = require("console");

//getUser
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { page, limit, sort } = req.query;

    if (id) {
      const getSelectedUser = await account.getUsersById({ id });

      connect.set("url", req.originalUrl, "ex", 10); // string only
      connect.set("data", JSON.stringify(getSelectedUser), "ex", 10); // string only
      connect.set("is_paginate", null, "ex", 10); // string only

      res.status(200).json({
        status: true,
        message: "data berhasil di tampilkan",
        data: getSelectedUser,
      });
    } else {
      // OFFSET & LIMIT
      let getAllUser;

      if (limit && page) {
        getAllUser = await account.getAllUsersPagination({ limit, page, sort });
      } else {
        getAllUser = await account.getAllUser({ sort });
      }

      // store data to redis for 10 seconds
      connect.set("url", req.originalUrl, "ex", 10); // string only
      connect.set("data", JSON.stringify(getAllUser), "ex", 10); // string only
      connect.set("total", getAllUser?.length, "ex", 10); // string only
      connect.set("limit", limit, "ex", 10); // string only
      connect.set("page", page, "ex", 10); // string only
      connect.set("is_paginate", "true", "ex", 10); // string only

      if (getAllUser.length > 0) {
        res.status(200).json({
          status: true,
          message: "data berhasil di ambil",
          total: getAllUser?.length,
          page: page,
          limit: limit,
          data: getAllUser,
        });
      } else {
        throw "Data kosong silahkan coba lagi";
      }
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

//CreateUser
const createUsers = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    const duplicateEmail = await account.getUserByEmail({ email });
    if (duplicateEmail.length >= 1) {
      throw { code: 401, message: "Email telah terdaftar" };
    }

    console.log(req.files);

    let fileResult;
    if (req.files && req.files.photo) {
      let file = req.files.photo;
      let fileName = `${uuidv4()}-${file.name}`;
      let uploadPath = `${path.dirname(
        require.main.filename
      )}/public/${fileName}`;
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
          function (error, result) {
            if (error) {
              throw "Upload foto gagal";
            } else {
              fileResult = result.url;
            }
          }
        );
      } else {
        throw "Upload foto gagal, Format tidak sesuai";
      }
    }
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        throw "Proses authentikasi gagal, silahkan coba lagi";
      }

      // Store hash in your password DB.
      const addToDb = await account.createUser({
        username,
        email,
        phone,
        password: hash,
        photo: fileResult,
      });

      res.json({
        status: true,
        message: "berhasil di tambah",
        data: addToDb,
        // path: uploadPath,
      });
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

//UpdateUser
const updateUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phone, password } = req.body;

    const getUser = await account.getUsersById({ id });
    if (!getUser) {
      throw "ID Tidak Terdaftar";
    }
    // res.json({
    //           status: true,
    //           message: 'berhasil di ubah'
    //       })

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

    bcrypt.hash(
      password || getUser[0].password,
      saltRounds,
      async (err, hash) => {
        if (err) {
          throw "Proses autentifikasi gagal, silahkan coba lagi";
        }

        if (getUser) {
          await account.updateUsers({
            username:
              !username || username === "" ? getUser[0].username : username,
            email: !email || email === "" ? getUser[0].email : email,
            phone: !phone || phone === "" ? getUser[0].phone : phone,
            password: !password || password === "" ? getUser[0].password : hash,
            photo: fileName ? `/images/${fileName}` : null,
            getUser: getUser[0],
            id,
          });
          res.json({
            status: true,
            message: "berhasil di ubah",
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

//DeleteUser
const deleteUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const checkDuplicateId = await account.getUsersById({ id });
    if (checkDuplicateId <= 0) {
      throw { code: 400, message: "id tidak ditemukkan" };
    }

    account.deleteUser({ id });

    res.json({
      status: true,
      message: "berhasil di hapus",
    });
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

module.exports = { getUser, createUsers, updateUsers, deleteUsers };
