import db from "../../../../models/index";

const fetchAllGenre = async (page, limit) => {
  let genres = [];

  try {
    genres = await db.Genre.findAndCountAll({
      offset: (page - 1) * limit,
      limit: limit,
      order: [["id", "ASC"]],
    });

    return {
      EM: "Fetch genre successfully",
      EC: 0,
      DT: genres,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error, //error message
      EC: -2, //error code
      DT: "", //data
    };
  }
};

export { fetchAllGenre };
