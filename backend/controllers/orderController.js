const orderService = require("../services/orderService");

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const order = await orderService.createOrder({
            ...req.body,
            userId,
        });
        console.log(">>>>>>>>", order)

        return res.status(201).json({
            success: true,
            message: "Order created successfully.",
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderService.getOrderById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const { search, sort, status } = req.query;
        const orders = await orderService.getAllOrders({ search, sort, status });

        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { search, sort, status } = req.query;
        const orders = await orderService.getMyOrders(userId, { search, sort, status });

        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};