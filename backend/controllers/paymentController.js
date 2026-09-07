const paymentService = require("../services/paymentService");
const orderService = require("../services/orderService");

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("amount", amount)
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const order = await paymentService.createOrder(amount);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      cartItems,
      totalAmount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required and must not be empty.",
      });
    }

    const isValid = paymentService.verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }

    const orderPayload = {
      userId,
      totalAmount,
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      items: cartItems,
    };

    const order = await orderService.createOrder(orderPayload);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("verifyPayment caught error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};