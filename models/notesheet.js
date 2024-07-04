const { DataTypes } = require("sequelize");

const sequelize = require("../utils/db");

const NoteSheet = sequelize.define("notesheet", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  eventDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  days: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  faculty: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  school: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  department: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  subject: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  details: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  objectives: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  proposers: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
  },

  status: {
    type: DataTypes.TEXT,
    defaultValue: "Pending",
  },

  edit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  finance: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },

  // files: {
  //   type: DataTypes.TEXT,
  //   allowNull: true,
  // },
});

module.exports = NoteSheet;
