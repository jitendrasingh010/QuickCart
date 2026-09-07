const config = require("./config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    config.database,
    config.user,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        pool: config.pool,

        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
);

module.exports = sequelize;