const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middelware/auth.js");

router.post("/createOrder", auth, orderController.createOrder);
router.get("/orders", auth, orderController.getAllOrders);
router.get("/getorder", auth, orderController.getAllOrders);
router.get("/my-orders", auth, orderController.getMyOrders);
router.get("/get/:orderId", auth, orderController.getOrderById);

module.exports = router;