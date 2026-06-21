import {
  fetchAllUser,
  createNewUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../service/userService";

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
    return await res.status(500).json({
      EM: "Error from server" + error, //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

const handleCreateNewUser = async (req, res) => {
  let data = await createNewUser(req.body);
  return await res.status(200).json({
    EM: data.EM, //error message
    EC: data.EC, //error code
    DT: data.DT, //data
  });
};

const getUserWithId = async (req, res) => {
  const userId = req.params.id;

  let data = await getUserById(userId);
  return await res.status(200).json({
    EM: data.EM, //error message
    EC: data.EC, //error code
    DT: data.DT, //data
  });
};

const handleUpdateUser = async (req, res) => {
  const userId = req.params.id;

  if (
    !req.body.email ||
    !req.body.username ||
    !req.body.address ||
    !req.body.sex ||
    !req.body.phone ||
    !req.body.groupId
  ) {
    return res.status(200).json({
      EM: "Missing required parameters", //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
  let data = await updateUser(userId, req.body);

  return await res.status(200).json({
    EM: data.EM, //error message
    EC: data.EC, //error code
    DT: data.DT, //data
  });
};

const handleDelete = async (req, res) => {
  const userId = req.params.id;

  let data = await deleteUser(userId);
  return await res.status(200).json({
    EM: data.EM, //error message
    EC: data.EC, //error code
    DT: data.DT, //data
  });
};

const getUserAccount = async (req, res) => {
  return res.status(200).json({
    EM: "ok",
    EC: 0,
    DT: {
      email: req.user.email,
      username: req.user.username,
      access_token: req.token,
      groupWithRoles: req.user.groupWithRoles,
    },
  });
};

export {
  getAllUser,
  handleCreateNewUser,
  getUserWithId,
  handleUpdateUser,
  handleDelete,
  getUserAccount,
};
