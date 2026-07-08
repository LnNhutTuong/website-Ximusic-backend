import { where } from "sequelize";
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

const createNewGenre = async (rawData) => {
  try {
    let newGenre = await db.Genre.create({
      name: rawData.name,
      description: rawData.description,
      icon: rawData.icon,
    });

    return {
      EM: "Create new Genre Successfully", //error message
      EC: 0, //error code
      DT: rawData, //data
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error, //error message
      EC: -2, //error code
      DT: "", //data
    };
  }
};

const getGenreWithId = async (id) => {
  try {
    let genreWithID = await db.Genre.findOne({
      where: { id },
    });

    return {
      EM: "Get Genre with Id Successfully", //error message
      EC: 0, //error code
      DT: genreWithID, //data
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error, //error message
      EC: -2, //error code
      DT: "", //data
    };
  }
};

const updateGenre = async (id, rawData) => {
  try {
    const [updatedRows] = await db.Genre.update(
      {
        name: rawData.name,
        description: rawData.description,
        icon: rawData.icon,
      },
      { where: { id } },
    );

    if (updatedRows === 0) {
      return {
        EM: "Genre not found or no changes made",
        EC: -1,
        DT: null,
      };
    }

    const updatedGenre = await db.Genre.findByPk(id);

    return {
      EM: "Update Genre Successfully",
      EC: 0,
      DT: updatedGenre,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: "",
    };
  }
};

const hasSongInGenre = async (genreId) => {
  const songUsed = await db.Song.findOne({
    where: { genreId },
  });

  return songUsed;
};

const deleteGenre = async (genreId) => {
  try {
    const isUsed = await hasSongInGenre(genreId);

    if (isUsed) {
      return {
        EM: "Cannot delete Genre because it contains songs",
        EC: -1,
        DT: isUsed,
      };
    }

    await db.Genre.destroy({
      where: { id: genreId },
    });
    return {
      EM: "Delete Genre Successfully",
      EC: 0,
    };
  } catch (error) {
    return {
      EM: "Something went wrong in service..." + error,
      EC: -2,
      DT: "",
    };
  }
};
export {
  fetchAllGenre,
  createNewGenre,
  getGenreWithId,
  updateGenre,
  deleteGenre,
};
