require("dotenv").config({ path: "./.env.production" });

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("postgres://default:TdP9njw6IZyX@ep-nameless-poetry-a12z08fl.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require"
,
  {
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
