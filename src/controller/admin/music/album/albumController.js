import {
  getAlbumOptionWithIdOrNot,
  getListAlbum,
  getAlbumWithId,
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
    const id = req.query.id || null;

    if (!id) {
      return res.status(400).json({
        EM: "Missing required data...",
        EC: -1,
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

export {
  handleAlbumOptionWithIdOrNot,
  handleGetAlbumWithId,
  handleGetListAlbums,
};
