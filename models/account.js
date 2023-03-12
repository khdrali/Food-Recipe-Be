const db = require("../db");

//get user by id
const getUsersById = async (params) => {
  const { id } = params;

  return await db`SELECT * FROM account WHERE id = ${id}`;
};

//get user pagination
const getAllUsersPagination = async (params) => {
  const { limit, page, sort } = params;

  return await db`SELECT * FROM account ${
    sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)} `;
};

//get all users
const getAllUser = async (params) => {
  return await db`SELECT * FROM account`;
};

//CreateUser
const createUser = async (params) => {
  const { username, email, password, phone, photo } = params;
  if (!photo) {
    return await db`
    INSERT INTO account (username, email, password, phone) 
    VALUES (${username}, ${email}, ${password}, ${phone})
  `;
  } else {
    return await db`
      INSERT INTO account (username, email, password, phone, photo) 
      VALUES (${username}, ${email}, ${password}, ${phone}, ${photo})
    `;
  }
};

//Update user
const updateUsers = async (params) => {
  const { username, email, phone, password, photo, getUser, id } = params;
  await db`
          UPDATE account SET
            "username" = ${username || getUser?.name},
            "email" = ${email || getUser?.email},
            "phone" = ${phone || getUser?.phone},
            "password" = ${password || getUser?.password},
            "photo" = ${photo || getUser?.photo}
          WHERE "id" = ${id};
        `;
};

//Delete User
const deleteUser = async (params) => {
  const { id } = params;
  return await db`DELETE FROM "public"."account" WHERE "id" = ${id}`;
};

const getUserByEmail = async (params) => {
  const { email } = params;

  return await db`SELECT * FROM account WHERE email=${email}`;
};

module.exports = {
  getUsersById,
  getAllUsersPagination,
  getAllUser,
  createUser,
  deleteUser,
  updateUsers,
  getUserByEmail,
};
