const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../../database.sqlite'),
  logging: false
});

const configureSqlite = async () => {
  await sequelize.query('PRAGMA journal_mode = MEMORY;');
  await sequelize.query('PRAGMA synchronous = NORMAL;');
  await sequelize.query('PRAGMA busy_timeout = 5000;');
  await sequelize.query('PRAGMA foreign_keys = ON;');
};

module.exports = { sequelize, DataTypes, configureSqlite };
