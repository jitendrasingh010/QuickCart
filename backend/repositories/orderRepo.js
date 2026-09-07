const { Op } = require("sequelize");
const { OrderModel, OrderItemModel, ProductModel, UserModel } = require('../models/index');

exports.createOrder = async (orderData, transaction = null) => {
  return await OrderModel.create(orderData, {
    transaction,
  });
};

exports.createOrderItems = async (items, transaction = null) => {
  return await OrderItemModel.bulkCreate(items, {
    transaction,
  });
};

exports.getAllOrders = async (queryOptions = {}) => {
  const { search, sort, status } = queryOptions;

  const whereClause = {};

  if (status && status.trim() !== "") {
    const statusTerm = status.trim();
    whereClause[Op.or] = [
      { paymentStatus: { [Op.like]: `%${statusTerm}%` } },
      { orderStatus: { [Op.like]: `%${statusTerm}%` } },
    ];
  }

  if (search && search.trim() !== "") {
    const searchTerm = search.trim();
    const searchConditions = [
      { orderNumber: { [Op.like]: `%${searchTerm}%` } },
      { '$User.firstName$': { [Op.like]: `%${searchTerm}%` } },
      { '$User.lastName$': { [Op.like]: `%${searchTerm}%` } },
      { '$User.email$': { [Op.like]: `%${searchTerm}%` } },
    ];

    if (!isNaN(searchTerm)) {
      searchConditions.push({ orderId: Number(searchTerm) });
    }

    if (whereClause[Op.or]) {
      whereClause[Op.and] = [
        { [Op.or]: whereClause[Op.or] },
        { [Op.or]: searchConditions },
      ];
      delete whereClause[Op.or];
    } else {
      whereClause[Op.or] = searchConditions;
    }
  }

  let orderClause = [["createdAt", "DESC"]];

  if (sort) {
    switch (sort.toLowerCase()) {
      case "latest":
        orderClause = [["createdAt", "DESC"]];
        break;
      case "oldest":
        orderClause = [["createdAt", "ASC"]];
        break;
      case "amount_low_high":
        orderClause = [["totalAmount", "ASC"]];
        break;
      case "amount_high_low":
        orderClause = [["totalAmount", "DESC"]];
        break;
      default:
        orderClause = [["createdAt", "DESC"]];
        break;
    }
  }

  return await OrderModel.findAll({
    where: whereClause,
    include: [
      {
        model: UserModel,
        attributes: ["id", "firstName", "lastName", "email", "phone"],
      },
      {
        model: OrderItemModel,
        include: [
          {
            model: ProductModel,
          },
        ],
      },
    ],
    order: orderClause,
  });
};

exports.getOrderById = async (orderId) => {
  return await OrderModel.findByPk(orderId, {
    include: [
      {
        model: UserModel,
        attributes: ["id", "firstName", "lastName", "email", "phone"],
      },
      {
        model: OrderItemModel,
        include: [
          {
            model: ProductModel,
          },
        ],
      },
    ],
  });
};

exports.getMyOrders = async (userId, queryOptions = {}) => {
  const { search, sort, status } = queryOptions;

  const whereClause = {
    userId,
  };

  if (status && status.trim() !== "") {
    const statusTerm = status.trim();
    whereClause[Op.and] = whereClause[Op.and] || [];
    whereClause[Op.and].push({
      [Op.or]: [
        { paymentStatus: { [Op.like]: `%${statusTerm}%` } },
        { orderStatus: { [Op.like]: `%${statusTerm}%` } },
      ],
    });
  }

  if (search && search.trim() !== "") {
    const searchTerm = search.trim();
    const searchConditions = [
      { orderNumber: { [Op.like]: `%${searchTerm}%` } },
    ];

    if (!isNaN(searchTerm)) {
      searchConditions.push({ orderId: Number(searchTerm) });
    }

    whereClause[Op.and] = whereClause[Op.and] || [];
    whereClause[Op.and].push({
      [Op.or]: searchConditions,
    });
  }

  let orderClause = [["createdAt", "DESC"]];

  if (sort) {
    switch (sort.toLowerCase()) {
      case "latest":
        orderClause = [["createdAt", "DESC"]];
        break;
      case "oldest":
        orderClause = [["createdAt", "ASC"]];
        break;
      case "amount_low_high":
        orderClause = [["totalAmount", "ASC"]];
        break;
      case "amount_high_low":
        orderClause = [["totalAmount", "DESC"]];
        break;
      default:
        orderClause = [["createdAt", "DESC"]];
        break;
    }
  }

  return await OrderModel.findAll({
    where: whereClause,
    include: [
      {
        model: OrderItemModel,
        include: [
          {
            model: ProductModel,
          },
        ],
      },
    ],
    order: orderClause,
  });
};

exports.updateOrder = async (orderId, data, transaction = null) => {
  return await OrderModel.update(data, {
    where: {
      orderId,
    },
    transaction,
  });
};

exports.deleteOrder = async (orderId) => {
  return await OrderModel.destroy({
    where: {
      orderId,
    },
  });
};