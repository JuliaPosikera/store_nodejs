const express = require('express');
const router = express.Router();

const shopController = require('../controller/shop');

router.get('/products-list', shopController.getProducts);
router.get('/', shopController.getIndex);
router.get('/cart', shopController.getCart);
router.get('/checkout', shopController.getCheckout);
router.get('/orders', shopController.getOrders);
router.get('/product/:productId', shopController.getProductDetail);

router.post('/add-to-cart', shopController.postCart);
router.post('/create-order', shopController.postOrder);
router.post('/cart-decr-item', shopController.postCartDecr);
router.post('/cart-delete-item', shopController.postCartDelete);

module.exports = router;
