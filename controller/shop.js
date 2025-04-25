const { redirect } = require('react-router-dom');
const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');

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
          qty: product['cart-item'].qty,
          price: product.price,
        });
        totalPrice = totalPrice + product['cart-item'].qty * product.price;
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
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders',
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
        product['cart-item'].qty = Number(product['cart-item'].qty) + 1;
        return product['cart-item'].save();
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

      if (product['cart-item'].qty > 1) {
        product['cart-item'].qty = Number(product['cart-item'].qty) - 1;
        return product['cart-item'].save();
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
