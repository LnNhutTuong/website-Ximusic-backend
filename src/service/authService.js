import bcrypt, { hash, hashSync } from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import db from "../models/index";
import { Op } from "sequelize";
import { getGroupWithRoles } from "./JWTService";
import { createJwt } from "../middleware/JWTAction";
require("dotenv").config();
const hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
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

const hanldeRegister = async (rawUserData) => {
  try {
    let emailExist = await checkEmail(rawUserData.email);
    let phoneExist = await checkPhone(rawUserData.phone);

    if (emailExist) {
      return {
        EM: "Email already exists",
        EC: 1,
        DT: "",
      };
    }

    if (phoneExist) {
      return {
        EM: "Phone number already exists",
        EC: 1,
        DT: "",
      };
    }

    let passwordHash = hashPassword(rawUserData.password);

    await db.User.create({
      email: rawUserData.email,
      phone: rawUserData.phone,
      username: rawUserData.username,
      password: passwordHash,
      groupId: 2,
    });

    //Create token

    return {
      EM: "Create user successfully",
      EC: 0,
      DT: "",
    };
  } catch (error) {
    console.log(">> ERROR << : ", error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: "",
    };
  }
};

const checkPassword = (inputPassword, password) => {
  return bcrypt.compareSync(inputPassword, password);
};

const checkValueLogin = async (valueLogin) => {
  let user = await db.User.findOne({
    where: {
      [Op.or]: [{ email: valueLogin }, { phone: valueLogin }],
    },
  });

  if (user) {
    return user;
  }

  return false;
};

const handleLogin = async (rawUserData) => {
  try {
    let user = await checkValueLogin(rawUserData.valueLogin);

    if (!user) {
      return {
        EM: "Email/Phone number are wrong",
        EC: 1,
        DT: "",
      };
    }

    let isCorrectPassword = await checkPassword(
      rawUserData.password,
      user.password,
    );

    if (!isCorrectPassword) {
      return {
        EM: "Password is incorrect",
        EC: 1,
        DT: "",
      };
    }

    //create token

    //get user
    let groupWithRoles = await getGroupWithRoles(user);

    let payload = {
      email: user.email,
      groupWithRoles,
      expiresIn: process.env.JWT_EXPIRES_IN,
    };
    let token = await createJwt(payload);

    return {
      EM: "Login successfully",
      EC: 0,
      DT: {
        access_token: token,
        groupWithRoles,
      },
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service... /" + error,
      EC: -2,
      DT: "",
    };
  }
};

module.exports = {
  hanldeRegister,
  handleLogin,
};
