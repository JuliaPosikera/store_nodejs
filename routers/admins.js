const express = require("express");
const adminController = require("../controller/admin");
const router = express.Router();

router.get("/add-product", adminController.getAddProduct);
router.get("/products", adminController.getAllProducts);
router.get("/edit-product/:productId", adminController.getEditProduct);

router.post("/add-product", adminController.postProduct);
router.post("/edit-product", adminController.postEditProduct);
router.post("/delete-product", adminController.deleteProduct);

module.exports = router;
