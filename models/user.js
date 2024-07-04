const { DataTypes } = require("sequelize");

const sequelize = require("../utils/db");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  position: {
    type: DataTypes.TEXT,
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

  phone: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  email: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  approveRight: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  superUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  notifications: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = User;
