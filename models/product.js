const fs = require("fs");
const path = require("path");
const dirPath = require("../util/path");
const Cart = require("./cart");

const p = path.join(dirPath, "data", "products.json");
const getProductsFromFile = (callback) => {
  fs.readFile(p, (err, fileContent) => {
    let products = [];
    if (!err) {
      products = JSON.parse(fileContent);
      return callback(products, p);
    }
    return callback([], p);
  });
};

module.exports = class Product {
  constructor(id, title, imgURL, description, price) {
    this.id = id;
    this.title = title;
    this.imgURL = imgURL;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          if (err) {
            console.log("Error writing updated product to file:", err);
          }
        });
      } else {
        this.id = (((1 + Math.random()) * 0x10000) | 0)
          .toString(16)
          .substring(1);
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (err) {
            console.log("Error writing new product to file:", err);
          }
        });
      }
    });
  }

  static delete(id) {
    getProductsFromFile((products) => {
      if (id) {
        const updatedProducts = products.filter((prod) => prod.id !== id);
        const price = products.find((product) => product.id == id).price;

        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          if (err) {
            console.log("Error writing products after deleting to file:", err);
          }
          Cart.deleteProductFromCart(id, price);
        });
      }
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static fetchProductById(id, callback) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      callback(product);
    });
  }
};
