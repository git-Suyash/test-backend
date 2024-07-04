require("dotenv").config({ path: "./.env.production" });

const { validationResult } = require("express-validator");
const sequelize = require("../utils/db");

const User = require("../models/user");

exports.getStats = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed!");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
    return;
  }

  const userId = req.userId;

  const getStats = async (department, school, faculty, where) => {
    const Department = department ? `department, ` : "";
    const School = school ? `school,` : "";
    const Faculty = faculty ? `faculty,` : "";
    const Where = where || "";

    const q = `select ${Faculty} ${School} ${Department} status, count(*), sum(finance) from notesheets ${Where} group by ${Faculty} ${School} ${Department} status`;

    return await sequelize.query(q);
  };

  try {
    const user = await User.findByPk(userId, {
      attributes: ["id", "position", "department", "school", "faculty"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (
      user.position === "Head of Department" ||
      user.position === "Deputy Head of Department"
    ) {
      const transformStats = (stats) => {
        const transformedStats = {};

        stats.forEach((stat) => {
          const department = stat.department;
          delete stat.department;

          if (!transformedStats[department]) {
            transformedStats[department] = [];
          }

          transformedStats[department].push(stat);
        });

        return {
          Stats: Object.entries(transformedStats).map(([key, value]) => ({
            [key]: value,
          })),
        };
      };

      const department = user.department;
      const stats = await getStats(
        1,
        null,
        null,
        `where department = '${department}'`,
      );
      const formatedStats = transformStats(stats[0]);
      return res.status(200).json(formatedStats);
    } else if (user.position === "Director") {
      const transformStats = (stats) => {
        const transformedStats = {};

        stats.forEach((stat) => {
          const school = stat.school;
          const department = stat.department;
          delete stat.school;
          delete stat.department;

          if (!transformedStats[school]) {
            transformedStats[school] = [];
          }

          const schoolIndex = transformedStats[school].findIndex(
            (item) => Object.keys(item)[0] === department,
          );

          if (schoolIndex === -1) {
            transformedStats[school].push({ [department]: [stat] });
          } else {
            transformedStats[school][schoolIndex][department].push(stat);
          }
        });

        return {
          Stats: Object.entries(transformedStats).map(([key, value]) => ({
            [key]: value,
          })),
        };
      };

      const school = user.school;
      const stats = await getStats(1, 1, null, `where school = '${school}'`);
      const formatedStats = transformStats(stats[0]);
      return res.status(200).json(formatedStats);
    } else if (user.position === "Dean") {
      const transformStats = (stats) => {
        const transformedStats = {};

        stats.forEach((stat) => {
          const faculty = stat.faculty;
          const school = stat.school;
          const department = stat.department;
          delete stat.faculty;
          delete stat.school;
          delete stat.department;

          if (!transformedStats[faculty]) {
            transformedStats[faculty] = [];
          }

          const facultyIndex = transformedStats[faculty].findIndex(
            (item) => Object.keys(item)[0] === school,
          );

          if (facultyIndex === -1) {
            transformedStats[faculty].push({
              [school]: [{ [department]: [stat] }],
            });
          } else {
            const schoolObj = transformedStats[faculty][facultyIndex];
            if (!schoolObj[school]) {
              schoolObj[school] = [{ [department]: [stat] }];
            } else {
              const schoolIndex = schoolObj[school].findIndex(
                (item) => Object.keys(item)[0] === department,
              );

              if (schoolIndex === -1) {
                schoolObj[school].push({ [department]: [stat] });
              } else {
                schoolObj[school][schoolIndex][department].push(stat);
              }
            }
          }
        });

        return {
          Stats: Object.entries(transformedStats).map(([key, value]) => ({
            [key]: value,
          })),
        };
      };

      const faculty = user.faculty;
      const stats = await getStats(1, 1, 1, `where faculty = '${faculty}'`);
      const formatedStats = transformStats(stats[0]);
      return res.status(200).json(formatedStats);
    } else if (
      user.position === "Registrar" ||
      user.position === "Pro President" ||
      user.position === "President"
    ) {
      const transformStats = (stats) => {
        const transformedStats = {};

        stats.forEach((stat) => {
          const faculty = stat.faculty;
          const school = stat.school;
          const department = stat.department;
          delete stat.faculty;
          delete stat.school;
          delete stat.department;

          if (!transformedStats[faculty]) {
            transformedStats[faculty] = [];
          }

          const facultyIndex = transformedStats[faculty].findIndex(
            (item) => Object.keys(item)[0] === school,
          );

          if (facultyIndex === -1) {
            transformedStats[faculty].push({
              [school]: [{ [department]: [stat] }],
            });
          } else {
            const schoolObj = transformedStats[faculty][facultyIndex];
            if (!schoolObj[school]) {
              schoolObj[school] = [{ [department]: [stat] }];
            } else {
              const schoolIndex = schoolObj[school].findIndex(
                (item) => Object.keys(item)[0] === department,
              );

              if (schoolIndex === -1) {
                schoolObj[school].push({ [department]: [stat] });
              } else {
                schoolObj[school][schoolIndex][department].push(stat);
              }
            }
          }
        });

        return {
          Stats: Object.entries(transformedStats).map(([key, value]) => ({
            [key]: value,
          })),
        };
      };

      const stats = await getStats(1, 1, 1);
      const formatedStats = transformStats(stats[0]);
      return res.status(200).json(formatedStats);
    } else {
      return res.status(401).json({
        message: "LOL 😂, you are not authorized to perform this action nigga",
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
