const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

const Weather = require('./weather')(sequelize, Sequelize);

module.exports = {
  sequelize,
  Weather,
};
