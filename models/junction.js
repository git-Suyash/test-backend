const { DataTypes } = require("sequelize");

const sequelize = require("../utils/db");

const Junction = sequelize.define("junction", {
  status: {
    type: DataTypes.TEXT,
    defaultValue: "Introduced",
  },

  rank: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Junction;
