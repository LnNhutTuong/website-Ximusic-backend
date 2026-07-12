import {
  checkIsArtist,
  getAllArtists,
} from "../../../service/admin/artist/artistService";

const checkArtist = async (req, res) => {
  try {
    if (!req.body.userId) {
      return {
        EM: "Missing userId for check Artist", //error message
        EC: 0, //error code
        DT: users, //data
      };
    }

    let data = await checkIsArtist(req.body.userId);
    return await res.status(200).json({
      EM: data.EM, //error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (e) {
    return await res.status(500).json({
      EM: "Error from server" + error, //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

const handleGetAllArtist = async (req, res) => {
  let data = await getAllArtists();
  return await res.status(200).json({
    EM: data.EM, //error message
    EC: data.EC, //error code
    DT: data.DT, //data
  });
};

export { checkArtist, handleGetAllArtist };
