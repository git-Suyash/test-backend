const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  secure: false,
  port: 587,
  auth: {
    user: "muj.nms@jaipur.manipal.edu",
    pass: "Muj@4680",
  },
});

exports.Mailer =(to, name) => {
  const templatePath = path.resolve('./views/emails/email.ejs');
  fs.readFile(templatePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading template file:", err);
      return;
    }

    const html = ejs.render(data, { name: name });

    const mailOptions = {
      from: "muj.nms@jaipur.manipal.edu",
      to: to,
      subject: 'NMS',
      html: html
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }
      console.log('Message sent: %s', info.messageId);
    });
  });
};

