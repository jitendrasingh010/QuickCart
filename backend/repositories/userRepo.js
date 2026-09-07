const { Op } = require("sequelize");
const { UserModel, OrderModel } = require('../models/index.js');

exports.findUserByEmail = async (email) => {
    return await UserModel.findOne({ where: { email } });
};

exports.findUserById = async (id) => {
    return await UserModel.findByPk(id, {
        attributes: { exclude: ['password'] }
    });
};

exports.createUser = async (userData) => {
    return await UserModel.create(userData);
};

exports.updateProfile = async (userId, data) => {
    return await UserModel.update(
        data,
        {
            where: {
                id: userId,
            },
        }
    );
};

exports.getUserById = async (userId) => {
    return await UserModel.findByPk(userId);
};

exports.updatePassword = async (userId, hashedPassword) => {
    return await UserModel.update(
        {
            password: hashedPassword,
        },
        {
            where: {
                id: userId,
            },
        }
    );
};

exports.getAllCustomers = async (queryOptions = {}) => {
    const { search, sort } = queryOptions;

    const whereClause = {
        role: "customer",
    };

    if (search && search.trim() !== "") {
        const searchTerm = search.trim();
        whereClause[Op.or] = [
            { firstName: { [Op.like]: `%${searchTerm}%` } },
            { lastName: { [Op.like]: `%${searchTerm}%` } },
            { email: { [Op.like]: `%${searchTerm}%` } },
        ];
    }

    let orderClause = [["createdAt", "DESC"]];

    if (sort) {
        switch (sort.toLowerCase()) {
            case "name_asc":
                orderClause = [["firstName", "ASC"], ["lastName", "ASC"]];
                break;
            case "name_desc":
                orderClause = [["firstName", "DESC"], ["lastName", "DESC"]];
                break;
            case "latest":
                orderClause = [["createdAt", "DESC"]];
                break;
            case "oldest":
                orderClause = [["createdAt", "ASC"]];
                break;
            default:
                orderClause = [["createdAt", "DESC"]];
                break;
        }
    }

    return await UserModel.findAll({
        where: whereClause,
        attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "phone",
            "gender",
            "status",
            "createdAt",
        ],
        order: orderClause,
    });
};

exports.getCustomerDetailsById = async (id) => {
    return await UserModel.findOne({
        where: {
            id,
            role: "customer",
        },
        attributes: { exclude: ["password"] },
        include: [
            {
                model: OrderModel,
                as: "Orders",
                attributes: [
                    "orderId",
                    "orderNumber",
                    "totalAmount",
                    "paymentMethod",
                    "paymentStatus",
                    "createdAt",
                ],
            },
        ],
        order: [[{ model: OrderModel, as: "Orders" }, "createdAt", "DESC"]],
    });
};

exports.saveOTP = async (userId, otp, expiry) => {
    return await UserModel.update(
        {
            resetOtp: otp,
            resetOtpExpiry: expiry,
        },
        {
            where: {
                id: userId,
            },
        }
    );
};