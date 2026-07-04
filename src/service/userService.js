import bcrypt, { hashSync } from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
import db from "../models/index";
import { Op, where, findOrCreate } from "sequelize";
import { handleGetArtistWithId } from "./artistService";
import { songCount } from "./songService";
import { albumCount } from "./albumService";

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

const createNewUser = async (rawData) => {
  try {
    let userHashPassword = hashPassword(rawData.password);

    let emailExist = await checkEmail(rawData.email);

    if (emailExist) {
      return {
        EM: "Email is exist",
        EC: -1,
        DT: rawData,
      };
    }

    let newUser = await db.User.create({
      email: rawData.email,
      password: userHashPassword,
      displayName: rawData.displayName,
      groupId: rawData.groupId,
    });

    let artist = null;
    if (rawData.groupId === 2) {
      artist = await db.ArtistProfile.create({
        userId: newUser.id,
        verified: rawData.statusVerify,
        monthlyListeners: 0,
      });
    }

    return {
      EM: "Create new user successfully",
      EC: 0,
      DT: { information: newUser, artist: artist },
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
  let artistProfile;
  try {
    user = await db.User.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ["password"] },
    });

    if (user.groupId === 2) {
      artistProfile = await handleGetArtistWithId(user.id);
    }

    return {
      EM: "Get user by Id successfully",
      EC: 0,
      DT: { information: user, artist: artistProfile },
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: "",
    };
  }
};

const updateUser = async (id, rawData) => {
  try {
    let emailExist = await checkEmail(rawData.email, id);

    if (emailExist) {
      return {
        EM: "Email is exist",
        EC: -1,
        DT: rawData.email,
      };
    }

    let userAfterUpdate = await db.User.update(
      {
        email: rawData.email,
        displayName: rawData.displayName,
        groupId: rawData.groupId,
      },
      {
        where: {
          id: id,
        },
      },
    );

    let artistProfile = null;

    if (rawData.groupId === 2) {
      const [profile, created] = await db.ArtistProfile.findOrCreate({
        where: {
          userId: id,
        },
        defaults: {
          userId: id,
          verified: rawData.statusVerify,
          monthlyListeners: 0,
        },
      });
      artistProfile = profile;
      if (!created) {
        await artistProfile.update({
          verified: rawData.statusVerify,
        });
      }
    } else {
      await db.ArtistProfile.destroy({
        where: {
          userId: id,
        },
      });
    }

    return {
      EM: "Update successfully",
      EC: 0,
      DT: { information: userAfterUpdate, artist: artistProfile },
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
    let isArtist = await handleGetArtistWithId(id);

    if (isArtist) {
      let songs = await songCount(id);
      let albums = await albumCount(id);

      if (songs > 0 || albums > 0) {
        return {
          EM: "Artist still has some songs and albums.",
          EC: -1,
          DT: { songCount: songs, albumCount: albums },
        };
      } else {
        await db.ArtistProfile.destroy({
          where: {
            userId: id,
          },
        });
      }
    }

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
