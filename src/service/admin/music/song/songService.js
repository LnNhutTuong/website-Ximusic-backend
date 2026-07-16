import db from "../../../../models/index";
import { Op, where, findOrCreate } from "sequelize";
import { deleteFile } from "../../../../utils/fileHelper";

const songCount = async (ownerId) => {
  let song = await db.Song.count({
    where: {
      ownerId: ownerId,
    },
  });
  return song;
};

const getAllSongs = async (page, limit) => {
  let songs = [];

  try {
    songs = await db.Song.findAndCountAll({
      offset: (page - 1) * limit,
      limit: limit,
      order: [["id", "ASC"]],
    });

    return {
      EM: "Fetch Song successfully",
      EC: 0,
      DT: songs,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error, //error message
      EC: -2, //error code
      DT: "", //data
    };
  }
};

const createNewSong = async (rawData) => {
  try {
    console.log(">>>Check genre:", rawData.genreId);
    let newSong;
    let songGenre;
    let features;

    newSong = await db.Song.create({
      title: rawData.title,
      audioUrl: rawData.audioUrl,
      cover: rawData.cover,
      duration: rawData.duration,
      lyrics: rawData.lyrics,
      ownerId: rawData.ownerId,
      albumId: rawData.albumId || null,
    });

    await newSong.setGenres(rawData.genreId || []);

    await newSong.setFeatures(rawData.featureId || []);

    return {
      EM: "Create new Genre Successfully", //error message
      EC: 0, //error code
      DT: { Genre: songGenre, Song: newSong, feature: features }, //data
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error, //error message
      EC: -2, //error code
      DT: "", //data
    };
  }
};

const getSongWithId = async (songId) => {
  try {
    //song info
    let song = await db.Song.findOne({
      where: { id: songId },
      include: [
        {
          model: db.Genre,
          as: "genres",
          attributes: ["id", "name"],
          through: {
            attributes: [],
          },
        },
        {
          model: db.User,
          as: "features",
          attributes: ["id", "displayName"],
          through: {
            attributes: [],
          },
          include: [
            {
              model: db.ArtistProfile,
              as: "artistProfile",
              attributes: ["stageName"],
            },
          ],
        },
      ],
    });

    return {
      EM: "Get Song with Id Successfully",
      EC: 0,
      DT: song,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error, //error message
      EC: -2, //error code
      DT: "", //data
    };
  }
};

const updateSong = async (id, rawData) => {
  const song = await db.Song.findOne({
    where: { id: id },
  });

  if (!song) {
    return {
      EC: -1,
      EM: "Song not found",
    };
  }

  if (rawData.hasNewCover && song.cover) {
    deleteFile(song.cover);
  }

  if (rawData.hasNewAudioUrl && song.audioUrl) {
    deleteFile(song.audioUrl);
  }

  const nextCover = rawData.hasNewCover ? rawData.cover : song.cover;
  const nextAudioUrl = rawData.hasNewAudioUrl
    ? rawData.audioUrl
    : song.audioUrl;

  await song.update({
    title: rawData.title,
    audioUrl: nextAudioUrl,
    cover: nextCover,
    duration: rawData.duration,
    lyrics: rawData.lyrics,
    ownerId: rawData.ownerId,
    albumId: rawData.albumId || null,
  });

  await song.setGenres(rawData.genreId || []);

  await song.setFeatures(rawData.featureId || []);

  return {
    EC: 0,
    EM: "Update song successfully",
  };
};

export { songCount, getAllSongs, createNewSong, getSongWithId, updateSong };
