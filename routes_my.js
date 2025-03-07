const fs = require("fs");

products = ["first", "second", "third"];

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title> Add product page </title></head>");
    res.write(
      "<body> <form action='/create-product' method='POST'> <input type='text' name='productname'> <button type='Submit'>Add product</button></form>  </body>"
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/products") {
    res.write("<html>");
    res.write("<head><title> Add product page </title></head>");
    res.write("<body> <ul>");
    products.map((product) => {
      res.write(`<li> ${product} </li>`);
    });
    res.write("</ul></body>");
    res.write("</html>");
    return res.end();
  }
  if (url === "/create-product" && method === "POST") {
    body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      newproduct = Buffer.concat(body).toString().split("=")[1];
      products.push(newproduct);
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }
};

module.exports = requestHandler;
