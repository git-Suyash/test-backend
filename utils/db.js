require("dotenv").config({ path: "./.env.production" });

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    //Todo: Uncomment in production
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    dialect: "postgres",
    logging: false,
  },
);

//To test the connection
// sequelize
//   .authenticate()
//   .then((result) =>
//     console.log("Connection has been established successfully."),
//   )
//   .catch((error) => console.error("Unable to connect to the database:", error));

module.exports = sequelize;
