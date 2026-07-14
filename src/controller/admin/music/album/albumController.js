import { getAlbumOptionWithIdOrNot } from "../../../../service/admin/music/album/albumService";

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

export { handleAlbumOptionWithIdOrNot };
