require("dotenv").config({ path: "./.env.production" });

//const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const multer = require("multer");
const {storage, fileFilter} = require("./utils/fileUpload")
const { Mailer } = require("./utils/mail");
//const multer = require("multer");
//const faculties = require("./data/faculty");

const sequelize = require("./utils/db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const insightRoutes = require("./routes/insights");

const User = require("./models/user");
const NoteSheet = require("./models/notesheet");
const Junction = require("./models/junction");
const Remark = require("./models/remark");
const Chat = require("./models/chat");
const { Faculty, School, Department } = require("./models/faculty");

User.belongsToMany(NoteSheet, { through: Junction, onDelete: "CASCADE" });
NoteSheet.belongsToMany(User, { through: Junction, onDelete: "CASCADE" });
NoteSheet.hasMany(Junction, { foreignKey: "notesheetId" });
Junction.belongsTo(NoteSheet, { foreignKey: "notesheetId" });
Junction.belongsTo(User, { foreignKey: "userId" });

User.belongsToMany(NoteSheet, { through: Remark, onDelete: "CASCADE" });
NoteSheet.belongsToMany(User, { through: Remark, onDelete: "CASCADE" });
NoteSheet.hasMany(Remark, { foreignKey: "notesheetId" });
Remark.belongsTo(NoteSheet, { foreignKey: "notesheetId" });
Remark.belongsTo(User, { foreignKey: "userId" });

User.belongsToMany(NoteSheet, { through: Chat, onDelete: "CASCADE" });
NoteSheet.belongsToMany(User, { through: Chat, onDelete: "CASCADE" });
NoteSheet.hasMany(Chat, { foreignKey: "notesheetId" });
Chat.belongsTo(NoteSheet, { foreignKey: "notesheetId" });
Chat.belongsTo(User, { foreignKey: "userId" });

Faculty.hasMany(School, { foreignKey: 'facultyId' });
School.belongsTo(Faculty, { foreignKey: 'facultyId' });

School.hasMany(Department, { foreignKey: 'schoolId' });
Department.belongsTo(School, { foreignKey: 'schoolId' });

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// middlewares for file uploads
app.use("/new-notesheet",
  multer({ storage: storage, fileFilter: fileFilter }).array("files", 10),
);
app.use("/update-notesheet", multer({ storage: storage, fileFilter: fileFilter }).array("files", 10),)

app.use(helmet());
app.use(compression());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(userRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(insightRoutes);

app.use((error, req, res, next) => {
  //console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  return res.status(status).json({
    message: message,
    data: data,
  });
});

sequelize
  .authenticate()
//   //.sync({ force: true })
//   //   .then(async () => {
//   //     await sequelize.query("alter table remarks drop constraint remarks_pkey");
//   //   })
  .then(() => {
    console.log("Database Connected");
    app.listen(process.env.PORT);
    console.log("Application Server Running");

})
