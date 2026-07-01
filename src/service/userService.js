import bcrypt, { hashSync } from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import db from "../models/index";
import { Op, where } from "sequelize";

import { checkIsArtist } from "./artistService";
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
        "displayName",
        "groupId",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: db.Group,
          as: "group",
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

const checkEmail = async (userEmail, userId = null) => {
  //điều kiện là cái mail
  let whereCondition = {
    email: userEmail,
  };

  //nếu có userId thì chạy vào đây
  if (userId) {
    whereCondition.id = {
      // lấy id của cái mail đang tìm
      [Op.ne]: userId, //loại trừ cái id này ra
    };
  }

  let user = await db.User.findOne({
    where: whereCondition,
  });

  if (user) {
    return true;
  }

  return false;
};

const checkPhone = async (userPhone, userId = null) => {
  //điều kiện là cái mail
  let whereCondition = {
    phone: userPhone,
  };

  //nếu có userId thì chạy vào đây
  if (userId) {
    whereCondition.id = {
      // lấy id của cái mail đang tìm
      [Op.ne]: userId, //loại trừ cái id này ra
    };
  }

  let user = await db.User.findOne({
    where: whereCondition,
  });

  if (user) {
    return true;
  }

  return false;
};

const createNewUser = async (rawData) => {
  try {
    let userHashPassword = hashPassword(rawData.password);

    let emailExist = await checkEmail(rawData.email);
    let phoneExist = await checkPhone(rawData.phone);

    if (emailExist) {
      return {
        EM: "Email is exist",
        EC: -1,
        DT: rawData,
      };
    }

    if (phoneExist) {
      return {
        EM: "Phone is exist",
        EC: -1,
        DT: rawData,
      };
    }

    let newUser = await db.User.create({
      email: rawData.email,
      password: userHashPassword,
      displayName: rawData.displayName,
      phone: rawData.phone,
      address: rawData.address,
      sex: rawData.sex,
      groupId: rawData.groupId,
    });

    return {
      EM: "Create new user successfully",
      EC: 0,
      DT: rawData,
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error,
      EC: -2,
      DT: "",
    };
  }
};

const getUserById = async (id) => {
  let user;
  let artist;
  try {
    user = await db.User.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ["password"] },
    });

    artist = await checkIsArtist(user.id);

    return {
      EM: "Get user by Id successfully",
      EC: 0,
      DT: { information: user, artist },
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error,
      EC: -2,
      DT: "",
    };
  }
};

const updateUser = async (id, rawData) => {
  try {
    let emailExist = await checkEmail(rawData.email, id);
    let phoneExist = await checkPhone(rawData.phone, id);

    if (emailExist) {
      return {
        EM: "Email is exist",
        EC: -1,
        DT: rawData,
      };
    }

    if (phoneExist) {
      return {
        EM: "Phone is exist",
        EC: -1,
        DT: rawData,
      };
    }

    let userApterUpdate = await db.User.update(
      {
        email: rawData.email,
        displayName: rawData.displayName,
        phone: rawData.phone,
        address: rawData.address,
        sex: rawData.sex,
        groupId: rawData.groupId,
      },
      {
        where: {
          id: id,
        },
      },
    );

    return {
      EM: "Update successfully",
      EC: 0,
      DT: userApterUpdate,
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error,
      EC: -2,
      DT: "",
    };
  }
};

const deleteUser = async (id) => {
  try {
    await db.User.destroy({
      where: {
        id: id,
      },
    });
    return {
      EM: "Delete successfully",
      EC: 0,
      DT: "",
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error,
      EC: -2,
      DT: "",
    };
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
