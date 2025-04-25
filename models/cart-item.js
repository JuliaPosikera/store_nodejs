const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const CartItem = sequelize.define('cart-item', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  qty: { type: DataTypes.STRING, allowNull: false },
});

module.exports = CartItem;
