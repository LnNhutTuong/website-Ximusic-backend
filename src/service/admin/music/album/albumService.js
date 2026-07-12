import db from "../../../../models/index";
import { Op, where, findOrCreate } from "sequelize";

const albumCount = async (ownerId) => {
  const album = await db.Album.count({
    where: {
      ownerId: ownerId,
    },
  });
  return album;
};

export { albumCount };
