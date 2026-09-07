const sequelize = require("../config/db.config.js");

const UserModel = require("./userModel.js");
const CategoryModel = require("./categoryModel.js");
const ProductModel = require("./productModel.js");
const OrderModel = require("./orderModel");
const OrderItemModel = require("./orderItemModel");

CategoryModel.hasMany(ProductModel, {
    foreignKey: "categoryId",
});

ProductModel.belongsTo(CategoryModel, {
    foreignKey: "categoryId",
});

UserModel.hasMany(OrderModel, {
    foreignKey: "userId",
});

OrderModel.belongsTo(UserModel, {
    foreignKey: "userId",
});

OrderModel.hasMany(OrderItemModel, {
    foreignKey: "orderId",
});

OrderItemModel.belongsTo(OrderModel, {
    foreignKey: "orderId",
});

ProductModel.hasMany(OrderItemModel, {
    foreignKey: "productId",
});

OrderItemModel.belongsTo(ProductModel, {
    foreignKey: "productId",
});

module.exports = {
    sequelize,
    UserModel,
    CategoryModel,
    ProductModel,
    OrderModel,
    OrderItemModel,
};