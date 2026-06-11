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

const checkEmail = async (userEmail) => {
  let user = await db.User.findOne({
    where: {
      email: userEmail,
    },
  });

  if (user) {
    return true;
  }

  return false;
};

const checkPhone = async (userPhone) => {
  let user = await db.User.findOne({
    where: {
      phone: userPhone,
    },
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
      username: rawData.username,
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
