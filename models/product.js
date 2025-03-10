const db = require("../util/database");
const Cart = require("./cart");
module.exports = class Product {
  constructor(id, title, imgURL, description, price) {
    this.id = id;
    this.title = title;
    this.imgURL = imgURL;
    this.price = price;
    this.description = description;
  }

  save() {
    return db.execute(
      `INSERT INTO shop.products (title, price, imgURL, description) VALUES ('${this.title}', ${this.price}, '${this.imgURL}', '${this.description}');`
    );
  }

  update() {
    return db.execute(
      `UPDATE shop.products SET title = '${this.title}', price = ${this.price}, imgURL = '${this.imgURL}', description = '${this.description}' WHERE (id = ${this.id});`
    );
  }

  static delete(id) {
    return db.execute(`DELETE FROM shop.products WHERE (id = ${id})`);
  }

  static fetchAll(callback) {
    db.execute("SELECT * FROM shop.products;")
      .then((results) => {
        callback(results[0]);
      })
      .catch((error) => {
        console.log("Fetching all products data from database erroe" + error);
      });
  }

  static fetchProductById(id, callback) {
    db.execute(`SELECT * FROM shop.products WHERE id=${id}`)
      .then((results) => {
        callback(results[0][0]);
      })
      .catch((error) => {
        console.log("Fetching product by id from database error" + error);
      });
  }
};
