import db from "../../../../models/index";
import { Op, where, findOrCreate } from "sequelize";

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

    if (rawData.genreId?.length > 0) {
      songGenre = await newSong.setGenres(rawData.genreId);
    }

    if (rawData.featureId?.length > 0) {
      features = await newSong.setArtists(rawData.featureId);
    }

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

export { songCount, getAllSongs, createNewSong };
