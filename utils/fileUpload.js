const multer = require("multer");
const fs = require("fs");


const storage = multer.diskStorage({ //defines the destination of where the files are saved and the filenames
  destination: async function (req, file, cb) {
    const dir = `./notesheets/${req.body.notesheetId}`;

    try {
      await fs.promises.access(dir);
      cb(null, dir);
    } catch (error) {
      fs.promises
        .mkdir(dir)
        .then(() => cb(null, dir))
        .catch((error) => cb(error, null));
    }
  },
  filename: function (req, file, cb) {
    file.originalname.replaceAll("#", "_");
    file.originalname.replaceAll(" ", "_");
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => { //permits only files that are in pdf form
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = {storage, fileFilter};