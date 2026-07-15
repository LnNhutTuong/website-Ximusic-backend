import {
  getAllSongs,
  createNewSong,
  getSongWithId,
} from "../../../../service/admin/music/song/songService";

const handleGetAllSongs = async (req, res) => {
  try {
    if (!req.query.page || !req.query.limit) {
      return {
        EM: "Missing required parameters", //error message
        EC: 0, //error code
        DT: users, //data
      };
    }

    if (!req.query.page) {
      return {
        EM: "Page is required", //error message
        EC: 0, //error code
        DT: users, //data
      };
    }

    if (!req.query.limit) {
      return {
        EM: "Limit is required", //error message
        EC: 0, //error code
        DT: users, //data
      };
    }

    let data = await getAllSongs(+req.query.page, +req.query.limit);

    return await res.status(200).json({
      EM: data.EM, //error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    return await res.status(500).json({
      EM: "Something went wrong in controller..." + error, //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

const handleCreateNewSong = async (req, res) => {
  try {
    const { title, duration, lyrics, genreId, ownerId, albumId, featureId } =
      req.body;

    const coverFile = req.files?.cover?.[0];
    const audioFile = req.files?.audioUrl?.[0];

    const coverPath = coverFile
      ? `uploads/song/cover/${coverFile.filename}`
      : null;

    const audioPath = audioFile
      ? `uploads/song/audio/${audioFile.filename}`
      : null;

    if (!title || !duration || !lyrics || !ownerId || genreId.length < 0) {
      return await res.status(400).json({
        EM: "Missing required data", //error message
        EC: -1, //error code
        DT: req.body, //data
      });
    }

    if (!coverFile || !audioFile) {
      return await res.status(400).json({
        EM: "Missing required data", //error message
        EC: -1, //error code
        DT: req.files, //data
      });
    }

    let data = await createNewSong({
      title,
      duration,
      lyrics,
      genreId,
      ownerId,
      albumId,
      cover: coverPath,
      audioUrl: audioPath,
      featureId,
    });
    return await res.status(200).json({
      EM: data.EM, //error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    return await res.status(500).json({
      EM: "Something went wrong in controller..." + error, //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

const handleGetSongWithId = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(">>>>check id: ", id);
    if (!id) {
      return await res.status(400).json({
        EM: "Missing required parameter", //error message
        EC: -1, //error code
        DT: "", //data
      });
    }

    let data = await getSongWithId(id);

    return await res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return await res.status(500).json({
      EM: "Something went wrong in controller... abc" + error, //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

export { handleGetAllSongs, handleCreateNewSong, handleGetSongWithId };
