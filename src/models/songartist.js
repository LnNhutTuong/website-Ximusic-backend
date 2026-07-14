"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SongArtist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Song, {
        foreignKey: "songId",
        as: "song",
      });

      this.belongsTo(models.User, {
        foreignKey: "featureId",
        as: "feature",
      });
    }
  }
  SongArtist.init(
    {
      songId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      featureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      role: {
        type: DataTypes.ENUM("MAIN", "FEATURED"),
        allowNull: false,
        defaultValue: "MAIN",
      },
    },
    {
      sequelize,
      modelName: "SongArtist",
    },
  );
  return SongArtist;
};
