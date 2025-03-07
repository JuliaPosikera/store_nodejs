const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    path: "admin/add-product",
    editing: false,
  });
};

exports.getAllProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      pageTitle: "Products list",
      path: "/admin/products",
      products: products,
    });
  });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const productID = req.params.productId;
  Product.fetchProductById(productID, (product) => {
    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};
exports.postProduct = (req, res) => {
  const product = new Product(
    null,
    req.body.title,
    req.body.imgURL,
    req.body.description,
    req.body.price
  );
  product.save();
  res.redirect("/admin/products");
};

exports.postEditProduct = (req, res) => {
  const prodId = req.body.prodId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImgURL = req.body.imgURL;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImgURL,
    updatedDesc,
    updatedPrice
  );
  updatedProduct.save();

  res.redirect("/admin/products");
};

exports.deleteProduct = (req, res) => {
  const productID = req.body.prodId;
  Product.delete(productID);
  res.redirect("/admin/products");
};
