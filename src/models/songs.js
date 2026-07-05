"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Artist
      this.belongsTo(models.User, {
        foreignKey: "artistId",
        as: "artist",
      });

      // Album
      this.belongsTo(models.Album, {
        foreignKey: "albumId",
        as: "album",
      });

      // Playlist
      this.belongsToMany(models.Playlist, {
        through: models.PlaylistSong,
        foreignKey: "songId",
        otherKey: "playlistId",
        as: "playlists",
      });

      // lai lai
      this.belongsToMany(models.User, {
        through: models.LikedSong,
        foreignKey: "songId",
        otherKey: "userId",
        as: "likedByUsers",
      });

      this.belongsToMany(models.Genre, {
        through: models.SongGenre,
        foreignKey: "songId",
        otherKey: "genreId",
        as: "genres",
      });
    }
  }
  Song.init(
    {
      title: DataTypes.STRING,
      audioUrl: DataTypes.STRING,
      cover: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      plays: DataTypes.BIGINT,
      lyrics: DataTypes.TEXT,
      genreId: DataTypes.STRING,
      artistId: DataTypes.INTEGER,
      albumId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Song",
    },
  );
  return Song;
};
