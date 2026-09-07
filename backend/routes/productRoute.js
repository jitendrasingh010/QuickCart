const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middelware/upload");

router.post("/add", upload.single("productImage"), productController.addProduct);
router.get("/products", productController.getAllProducts);
router.get("/get/:productId", productController.getProductById);
router.put("/update/:productId", upload.single("productImage"), productController.updateProduct);
router.delete("/delete/:productId", productController.deleteProduct);
router.patch("/softdelete/:productId", productController.softdeleteProduct);

module.exports = router;