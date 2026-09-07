const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Order = sequelize.define(
  "Order",
  {
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    paymentMethod: {
      type: DataTypes.ENUM("razorpay"),
      allowNull: false,
      defaultValue: "razorpay",
    },

    paymentStatus: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },

    orderStatus: {
      type: DataTypes.ENUM(
        "Pending",
        "Confirmed",
        "Out for Delivery",
        "Delivered",
        "Cancelled"
      ),
      allowNull: false,
      defaultValue: "Pending",
    },

    razorpayOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    razorpayPaymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    razorpaySignature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

module.exports = Order;