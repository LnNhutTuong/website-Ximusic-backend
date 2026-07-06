import db from "../../../../models/index";
import { Op, where, findOrCreate } from "sequelize";

const songCount = async (artistId) => {
  let song = await db.Song.count({
    where: {
      artistId: artistId,
    },
  });
  return song;
};

export { songCount };
