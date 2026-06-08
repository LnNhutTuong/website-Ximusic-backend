import bcrypt, { hashSync } from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import db from "../models/index";

const hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

const fetchAllUser = async (page, limit) => {
  let users = [];
  try {
    users = await db.User.findAndCountAll({
      offset: (page - 1) * limit,
      limit: limit,

      attributes: [
        "id",
        "email",
        "username",
        "groupId",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: db.Group,
          attributes: ["name"],
        },
      ],
      order: [["id", "ASC"]],
    });

    return {
      EM: "Fetch user successfully", //error message
      EC: 0, //error code
      DT: users, //data
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error, //error message
      EC: -2, //error code
      DT: "", //data
    };
  }
};

const createNewUser = async (email, password, username) => {
  let userHashPassword = hashPassword(password);
  try {
    await db.User.create({
      email: email,
      password: userHashPassword,
      username: username,
    });
  } catch (error) {
    console.log(">>>>>check error: ", error);
  }
};

const getUserById = async (id) => {
  let user;
  try {
    user = await db.User.findOne({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log(">>>Check error: ", error);
  }
  return user;
};

const updateUser = async (email, password, username, id) => {
  let dataUpdate = {
    email: email,
    username: username,
  };

  if (password && password.trim()) {
    let userHashPassword = hashPassword(password);
    dataUpdate.password = userHashPassword;
  }

  try {
    await db.User.update(dataUpdate, {
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log(">>>>Check error: ", error);
  }
};

const deleteUser = async (id) => {
  try {
    await db.User.destroy({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log(">>>>Check error: ", error);
  }
};

module.exports = {
  hashPassword,
  fetchAllUser,
  createNewUser,
  getUserById,
  updateUser,
  deleteUser,
};
