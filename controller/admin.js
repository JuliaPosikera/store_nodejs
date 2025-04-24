const { where } = require('sequelize');
const Product = require('../models/product');
const { title } = require('process');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add product',
    path: 'admin/add-product',
    editing: false,
  });
};

exports.getAllProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('admin/products', {
        pageTitle: 'Products list',
        path: '/admin/products',
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const productID = req.params.productId;
  Product.findByPk(productID)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit product',
        path: 'admin/edit-product',
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postProduct = (req, res) => {
  const title = req.body.title;
  const imgURL = req.body.imgURL;
  const description = req.body.description;
  const price = req.body.price;

  Product.create({
    title: title,
    imgURL: imgURL,
    description: description,
    price: price,
  })
    .then((result) => {
      console.log('Product created successfully');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res) => {
  const prodId = req.body.prodId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImgURL = req.body.imgURL;
  const updatedDesc = req.body.description;

  Product.update(
    {
      title: updatedTitle,
      imgURL: updatedImgURL,
      description: updatedDesc,
      price: updatedPrice,
    },
    { where: { id: prodId } }
  )
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((error) => {
      console.log('Updating product error' + error);
    });
};

exports.deleteProduct = (req, res) => {
  const productID = req.body.prodId;
  Product.destroy({ where: { id: productID } })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((error) => {
      console.log(
        `Error deleting product with id= ${productID} from database` + error
      );
    });
};
