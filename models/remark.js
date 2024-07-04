const { DataTypes } = require("sequelize");

const sequelize = require("../utils/db");

const Remark = sequelize.define("remarks", {
  remark: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Remark;
