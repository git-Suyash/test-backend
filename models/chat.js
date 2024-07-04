const { DataTypes } = require("sequelize");

const sequelize = require("../utils/db");

const Chat = sequelize.define("chats", {
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  chat: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Chat;
