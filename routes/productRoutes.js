const express = require("express");
const router = express.Router();
const {
	createProduct,
	getProducts,
	getProductById,
	updateProduct,
	deleteProduct
} = require("../controllers/productcontroller");

router.get("/", getProducts);
router.get("/products", getProducts);
router.post("/products", createProduct);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;