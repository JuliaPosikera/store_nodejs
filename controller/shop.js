const { redirect } = require('react-router-dom');
const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getCart = (req, res) => {
  Cart.fetchAll((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            qty: cartProductData.qty,
            price: product.price,
          });
        }
      }

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts,
        totalPrice: cart.totalPrice,
      });
    });
  });
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};

exports.getIndex = (req, res) => {
  res.render('shop/index', {
    pageTitle: 'Main Page',
    path: '/',
  });
};

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders',
  });
};

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      pageTitle: 'Products list',
      path: '/products',
      products: products,
    });
  });
};

exports.getProductDetail = (req, res) => {
  const prodId = req.params.productId;
  Product.fetchProductById(prodId, (product) => {
    console.log(product);
    res.render('shop/product-detail', {
      pageTitle: 'Product detail',
      path: '/product-detail',
      product: product,
    });
  });
};

exports.postCart = (req, res) => {
  const productId = req.body.productId;
  Product.fetchProductById(productId, (product) => {
    Cart.addProductToCart(productId, product.price);
    res.redirect('/cart');
  });
};

exports.postCartDecr = (req, res) => {
  const productId = req.body.productId;
  Product.fetchProductById(productId, (procduct) => {
    Cart.decrProductInCart(productId, procduct.price);
    res.redirect('/cart');
  });
};

exports.postCartDelete = (req, res, next) => {
  const productId = req.body.productId;
  Product.fetchProductById(productId, (procduct) => {
    Cart.deleteProductFromCart(productId, procduct.price);
    res.redirect('/cart');
  });
};
