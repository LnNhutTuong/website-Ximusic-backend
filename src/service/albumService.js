import db from "../models/index";
import { Op, where, findOrCreate } from "sequelize";

const albumCount = async (artistId) => {
  const album = await db.Album.count({
    where: {
      artistId: artistId,
    },
  });
  return album;
};

export { albumCount };
