const express = require("express");
const router = express.Router();

const shopController = require("../controller/shop");

router.get("/products-list", shopController.getProducts);
router.get("/", shopController.getIndex);
router.get("/cart", shopController.getCart);
router.get("/checkout", shopController.getCheckout);
router.get("/orders", shopController.getOrders);
router.get("/product/:productId", shopController.getProductDetail);

router.post("/add-to-cart", shopController.postCart);

module.exports = router;
