import db from "../../../models/index";
import { Op, where } from "sequelize";

const handleGetArtistWithId = async (userId) => {
  try {
    let artist = await db.ArtistProfile.findOne({
      where: {
        userId,
      },
      attributes: { exclude: ["id", "userId"] },
    });
    return artist;
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: "",
    };
  }
};

const getAllArtists = async () => {
  try {
    const artists = await db.User.findAll({
      where: {
        groupId: 2,
      },
      attributes: ["id", "displayName"],
      order: [["displayName", "ASC"]],
      include: [
        {
          model: db.ArtistProfile,
          as: "artistProfile",
          attributes: ["verified", "stageName"], // hoặc các cột bạn cần
        },
      ],
    });

    return {
      EM: "Fetch artists successfully",
      EC: 0,
      DT: artists,
    };
  } catch (error) {
    return {
      EM: "Something went wrong..." + error,
      EC: -2,
      DT: [],
    };
  }
};

export { handleGetArtistWithId, getAllArtists };
