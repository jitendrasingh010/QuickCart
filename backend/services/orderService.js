const sequelize = require("../config/db.config");
const orderRepo = require("../repositories/orderRepo");
const productRepo = require("../repositories/productsRepo");

exports.createOrder = async (orderData) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            userId,
            totalAmount,
            paymentMethod,
            paymentStatus,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            items,
        } = orderData;

        const orderNumber = "ORD-" + Date.now();

        const orderToCreate = {
            userId,
            orderNumber,
            totalAmount,
            paymentMethod: (paymentMethod || "razorpay").toLowerCase(),
            paymentStatus: (paymentStatus || "paid").toLowerCase(),
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
        };

        const order = await orderRepo.createOrder(orderToCreate, transaction);

        const orderItems = items.map((item) => {
            const productId = item.productId || item.id;
            return {
                orderId: order.orderId,
                productId,
                quantity: item.quantity,
                price: item.price,
                subTotal: item.price * item.quantity,
            };
        });

        await orderRepo.createOrderItems(orderItems, transaction);

        for (const item of items) {
            const productId = item.productId || item.id;
            const product = await productRepo.getProductById(productId);

            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`${product.productName} is out of stock`);
            }

            await product.update(
                {
                    stock: product.stock - item.quantity,
                },
                {
                    transaction,
                }
            );
        }

        await transaction.commit();
        return order;

    } catch (error) {
        await transaction.rollback();
        console.error("Exception during order creation:", error);
        throw error;
    }
};

exports.getAllOrders = async (queryOptions = {}) => {
    return await orderRepo.getAllOrders(queryOptions);
};

exports.getOrderById = async (orderId) => {
    return await orderRepo.getOrderById(orderId);
};

exports.getMyOrders = async (userId, queryOptions = {}) => {
    return await orderRepo.getMyOrders(userId, queryOptions);
};