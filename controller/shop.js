const { redirect } = require('react-router-dom');
const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');
const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const User = require('../models/user');

const getProductFromCart = (user, productId) => {
  let fetchedCart;
  return user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return { fetchedCart, product };
    });
};

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then((cartProducts) => {
      const productsToDisplay = [];
      let totalPrice = 0;

      for (const product of cartProducts) {
        productsToDisplay.push({
          productData: product,
          qty: product.cartItem.qty,
          price: product.price,
        });
        totalPrice = totalPrice + product.cartItem.qty * product.price;
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: productsToDisplay,
        totalPrice: totalPrice.toFixed(2),
      });
    })
    .catch((err) => {
      console.log(err);
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
  req.user
    .getOrders()
    .then((order) => {
      return order.getProducts();
    })
    .then((order) => {
      const productsToDisplay = [];

      for (const product of cartProducts) {
        productsToDisplay.push({
          productData: product,
          qty: product.cartItem.qty,
          price: product.price,
        });
      }
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Orders',
        products: productsToDisplay,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((procducts) => {
      res.render('shop/product-list', {
        pageTitle: 'Products list',
        path: '/products',
        products: procducts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductDetail = (req, res) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        pageTitle: 'Product detail',
        path: '/product-detail',
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res) => {
  const productId = req.body.productId;

  getProductFromCart(req.user, productId)
    .then(({ fetchedCart, product }) => {
      if (product) {
        product.cartItem.qty = Number(product.cartItem.qty) + 1;
        return product.cartItem.save();
      }

      return Product.findByPk(productId).then((prod) => {
        return fetchedCart.addProduct(prod, { through: { qty: 1 } });
      });
    })
    .then(() => res.redirect('/cart'))
    .catch((err) => console.log(err));
};

exports.postCartDecr = (req, res) => {
  const productId = req.body.productId;

  getProductFromCart(req.user, productId)
    .then(({ fetchedCart, product }) => {
      if (!product) return;

      if (product.cartItem.qty > 1) {
        product.cartItem.qty = Number(product.cartItem.qty) - 1;
        return product.cartItem.save();
      }

      return fetchedCart.removeProduct(product);
    })
    .then(() => res.redirect('/cart'))
    .catch((err) => console.log(err));
};

exports.postCartDelete = (req, res) => {
  const productId = req.body.productId;

  getProductFromCart(req.user, productId)
    .then(({ fetchedCart, product }) => {
      if (!product) return;
      return fetchedCart.removeProduct(product);
    })
    .then(() => res.redirect('/cart'))
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  let fetchedCart;
  let cartProducts;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      cartProducts = products;
      console.log('USER');
      console.log(req.user instanceof User); // should be true
      console.log(Object.keys(req.user.__proto__));
      return req.user.createOrder();
    })
    .then((order) => {
      // Add products to order with qty from cart
      return order.addProducts(
        cartProducts.map((product) => {
          product.orderItem = { qty: product.cartItem.qty };
          return product;
        })
      );
    })
    .then(() => {
      // Clear cart
      return fetchedCart.setProducts(null); // removes all associations
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};
