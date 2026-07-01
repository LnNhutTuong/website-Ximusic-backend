"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Artist Profile
      this.hasOne(models.ArtistProfile, {
        foreignKey: "userId",
        as: "artistProfile",
      });

      // Songs  artist
      this.hasMany(models.Song, {
        foreignKey: "artistId",
        as: "songs",
      });

      // Albums  artist
      this.hasMany(models.Album, {
        foreignKey: "artistId",
        as: "albums",
      });

      // Playlist  user
      this.hasMany(models.Playlist, {
        foreignKey: "userId",
        as: "playlists",
      });

      // Like song
      this.belongsToMany(models.Song, {
        through: models.LikedSong,
        foreignKey: "userId",
        otherKey: "songId",
        as: "likedSongs",
      });

      this.belongsTo(models.Group, {
        foreignKey: "groupId",
        as: "group",
      });

      models.Group.hasMany(this, {
        foreignKey: "groupId",
        as: "users",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      displayName: DataTypes.STRING,
      avatar: DataTypes.STRING,
      groupId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
