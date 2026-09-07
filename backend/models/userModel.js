const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config.js');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('customer', 'admin'),
        allowNull: false,
        defaultValue: 'customer'
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    },
    resetOtp: {
    type: DataTypes.STRING,
    allowNull: true,
},

resetOtpExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
},
    
},
    {
        tableName: 'users',
        timestamps: true
    }
);

module.exports = User;
