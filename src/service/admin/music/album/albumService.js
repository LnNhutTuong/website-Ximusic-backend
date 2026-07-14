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

const getAlbumOptionWithIdOrNot = async (ownerId) => {
  let albums;
  let EM;
  if (ownerId === null || ownerId === undefined) {
    albums = await db.Album.findAndCountAll();
    EM = "Get Album Option Successfully";
  } else {
    albums = await db.Album.findAndCountAll({
      where: { ownerId },
      attributes: ["id", "title"],
      order: [["title", "ASC"]],
    });
    EM = "Get Album Option With ID Successfully";
  }

  return {
    EM: EM, //error message
    EC: 0, //error code
    DT: albums, //data
  };
};

export { albumCount, getAlbumOptionWithIdOrNot };
