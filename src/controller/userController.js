import { fetchAllUser } from "../service/userService";

const getAllUser = async (req, res) => {
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

    let data = await fetchAllUser(+req.query.page, +req.query.limit);

    return await res.status(200).json({
      EM: data.EM, //error message
      EC: data.EC, //error code
      DT: data.DT, //data
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error from server" + error, //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

export { getAllUser };
