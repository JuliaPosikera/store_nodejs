const fs = require("fs");
const path = require("path");
const dirPath = require("../util/path");

const p = path.join(dirPath, "data", "cart.json");

const getCartFromFile = (callback) => {
  fs.readFile(p, (err, fileContent) => {
    let cart = { products: [], totalprice: 0 };
    if (!err && fileContent.length > 0) {
      try {
        cart = JSON.parse(fileContent);
      } catch (e) {
        console.log("Error parsing JSON:", e);
      }
    }
    return callback(cart);
  });
};

module.exports = class Product {
  static addProductToCart = (id, productPrice) => {
    getCartFromFile((cart) => {
      if (!cart.products) {
        cart.products = [];
      }
      const existingItemIndex = cart.products.findIndex(
        (product) => product.id == id
      );
      const existingProduct = cart.products[existingItemIndex];
      if (existingProduct) {
        let updatedProduct = {
          ...existingProduct,
          qty: existingProduct.qty + 1,
        };
        cart.products[existingItemIndex] = updatedProduct;
      } else {
        let updatedProduct = { id: id, qty: 1 };
        cart.products.push(updatedProduct);
      }

      cart.totalprice += Number(productPrice);

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) console.log("Error writing to cart file:", err);
      });
    });
  };

  static decrProductInCart = (id, productPrice) => {
    getCartFromFile((cart) => {
      if (!cart.products || cart.products.length === 0) {
        return;
      }
      const existingItemIndex = cart.products.findIndex(
        (product) => product.id == id
      );

      if (existingItemIndex === -1) {
        return;
      }

      const existingProduct = cart.products[existingItemIndex];
      if (existingProduct.qty > 1) {
        existingProduct.qty -= 1;
        cart.products[existingItemIndex] = existingProduct;
      } else {
        cart.products.splice(existingItemIndex, 1);
      }

      cart.totalprice = Math.max(0, cart.totalprice - Number(productPrice));

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) console.log("Error deleting product from cart", err);
      });
    });
  };

  static deleteProductFromCart(id, price) {
    getCartFromFile((cart) => {
      if (id) {
        const productToDelete = cart.products.find((prod) => prod.id == id);
        const priceToDelete = price * productToDelete.qty;
        const updatedProducts = cart.products.filter((prod) => prod.id !== id);
        const updatedPrice = Math.max(0, cart.totalprice - priceToDelete);

        fs.writeFile(
          p,
          JSON.stringify({
            products: updatedProducts,
            totalPrice: updatedPrice,
          }),
          (err) => {
            if (err) {
              console.log(
                "Error writing products after deleting item from cart to file:",
                err
              );
            }
          }
        );
      }
    });
  }

  static fetchAll(callback) {
    getCartFromFile(callback);
  }
};
