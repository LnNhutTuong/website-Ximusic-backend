import {
  getAlbumOptionWithIdOrNot,
  getListAlbum,
  getAlbumWithId,
  createNewAlbum,
} from "../../../../service/admin/music/album/albumService";

const handleAlbumOptionWithIdOrNot = async (req, res) => {
  try {
    const id = req.query.id || null;

    const data = await getAlbumOptionWithIdOrNot(id);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -1,
      DT: "",
    });
  }
};

const handleGetListAlbums = async (req, res) => {
  try {
    let data = await getListAlbum();

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
      DT: "",
    });
  }
};

const handleGetAlbumWithId = async (req, res) => {
  try {
    let id = req.params.id;

    if (!id) {
      return res.status(400).json({
        EM: "Missing required data...",
        EC: -1,
        DT: req.query,
      });
    }

    let data = await getAlbumWithId(id);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
      DT: "",
    });
  }
};

const handleCreateNewAlbum = async (req, res) => {
  try {
    const { title, cover, ownerId, songId, releaseDate } = req.body;

    if (!title || !ownerId || (releaseDate && !songId)) {
      return res.status(400).json({
        EM: "Missing required parameters controller", //error message
        EC: 0, //error code
        DT: req.body,
      });
    }

    const coverFile = req.file;

    const coverPath = coverFile
      ? `uploads/album/cover/${coverFile.filename}`
      : null;

    let data = await createNewAlbum({
      title,
      cover: coverPath,
      ownerId,
      songId,
      releaseDate,
    });

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Something went wrong in controller..." + error,
      EC: -2,
    });
  }
};

export {
  handleAlbumOptionWithIdOrNot,
  handleGetAlbumWithId,
  handleGetListAlbums,
  handleCreateNewAlbum,
};
