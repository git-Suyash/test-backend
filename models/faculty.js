const { DataTypes } = require("sequelize");

const sequelize = require("../utils/db");

const Faculty = sequelize.define('Faculty', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const School = sequelize.define('School', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    facultyId: {
        type: DataTypes.INTEGER,
        references: {
            model: Faculty,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
});

const Department = sequelize.define('Department', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    schoolId: {
        type: DataTypes.INTEGER,
        references: {
            model: School,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
});

module.exports = {
    Faculty,
    School,
    Department
}