import db from "../models/index";
import { Op, where } from "sequelize";

const checkIsArtist = async (userId) => {
  let artist = await db.ArtistProfile.findOne({
    where: {
      userId: userId,
    },
  });

  return {
    isArtist: !!artist,
    verify: +artist?.verified,
  };
};

export { checkIsArtist };
