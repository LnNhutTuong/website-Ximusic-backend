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

export { handleGetArtistWithId };
