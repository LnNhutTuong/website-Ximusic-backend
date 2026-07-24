import db from "../../../../models/index";
import { Op, where, findOrCreate, literal } from "sequelize";
import { deleteFile } from "../../../../utils/fileHelper";

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
  if (ownerId === null) {
    albums = await db.Album.findAndCountAll();
    EM = "Get Album Option Successfully";
  } else {
    albums = await db.Album.findAndCountAll({
      where: { ownerId },
      attributes: ["id", "title"],
      order: [["title", "ASC"]],
    });

    if (albums.count === 0) {
      EM = "This artist doesn't have any album";
    } else {
      EM = "Get Album Option With ID Successfully";
    }
  }

  return {
    EM: EM, //error message
    EC: 0, //error code
    DT: albums, //data
  };
};

const countSongInAlbum = async (albumId) => {
  const songCount = await db.Song.count({
    where: { albumId },
  });
  return songCount;
};

const getListAlbum = async () => {
  try {
    let albums = await db.Album.findAndCountAll({
      attributes: {
        include: [
          [
            literal(
              `COALESCE(\`artist->artistProfile\`.\`stageName\`,
          \`artist\`.\`displayName\`)`,
            ),
            "artistName",
          ],
        ],
      },
      include: [
        {
          model: db.User,
          as: "artist",
          attributes: [],
          include: [
            { model: db.ArtistProfile, as: "artistProfile", attributes: [] },
          ],
        },
      ],
    });

    for (let album of albums.rows) {
      album.dataValues.songCount = await countSongInAlbum(album.id);
    }

    return {
      EM: "get list Album Successfully",
      EC: 0,
      DT: albums,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: [],
    };
  }
};

const getAlbumWithId = async (albumId) => {
  try {
    let album = await db.Album.findOne({
      where: { id: albumId },
      include: {
        model: db.Song,
        as: "songs",
        attributes: ["id", "title"],
      },
    });

    return {
      EM: "Get Album with ID Successfully",
      EC: 0,
      DT: album,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: [],
    };
  }
};

const createNewAlbum = async (rawData) => {
  try {
    let newAlbum;
    let songBelongsTo;

    newAlbum = await db.Album.create({
      title: rawData.title.trim(),
      cover: rawData.cover,
      ownerId: rawData.ownerId,
      releaseDate: rawData.releaseDate || null,
    });

    if (rawData.songId) {
      await db.Song.update(
        { albumId: newAlbum.id },
        {
          where: {
            id: rawData.songId,
          },
        },
      );
    }

    return {
      EM: "Successfully",
      EC: 0,
      DT: { "New Album": newAlbum, "Song belongs": songBelongsTo },
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: [],
    };
  }
};

const updateAlbum = async (albumId, rawData) => {
  try {
    let albumUpdate = await db.Album.findOne({ where: { id: albumId } });

    if (!albumUpdate) {
      return {
        EM: "Can't find this album in db to update",
        EC: -1,
      };
    }

    if (rawData.hasNewCover && albumUpdate.cover) {
      deleteFile(albumUpdate.cover);
    }

    const nextCover = rawData.hasNewCover ? rawData.cover : albumUpdate.cover;

    await albumUpdate.update({
      title: rawData.title.trim(),
      cover: nextCover,
      ownerId: rawData.ownerId,
      releaseDate: new Date(rawData.releaseDate) || null,
    });

    if (rawData.songId) {
      await db.Song.update(
        { albumId: updateAlbum.id },
        {
          where: {
            id: rawData.songId,
          },
        },
      );
    }

    let albumAfterUpdate = await db.Album.findByPk(albumId);

    return {
      EM: "Update Album Successfully",
      EC: 0,
      DT: albumAfterUpdate,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: [],
    };
  }
};

const deleteAlbum = async (albumId) => {
  try {
    const albumDelete = await db.Album.findOne({
      where: { id: albumId },
    });

    if (!albumDelete) {
      return {
        EM: "Can't find this album in db to delete",
        EC: -1,
        DT: [],
      };
    }

    if (albumDelete.cover) {
      deleteFile(albumDelete.cover);
    }

    await db.Song.update({ albumId: null }, { where: { albumId } });

    await albumDelete.destroy();

    return {
      EM: "Delete Album Successfully",
      EC: 0,
    };
  } catch (error) {
    console.error(error);
    return {
      EM: "Something went wrong in service...",
      EC: -2,
      DT: [],
    };
  }
};

export {
  albumCount,
  getAlbumOptionWithIdOrNot,
  getListAlbum,
  getAlbumWithId,
  createNewAlbum,
  updateAlbum,
  deleteAlbum,
};
