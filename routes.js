const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title> Enter message </title></head>");
    res.write(
      "<body> <h2> Add your message, please! </h2> <form action='/message' method='POST'><input type='text' name='textmessage'></input><button type='submit'>Sent</button></form> </body>"
    );

    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
      // console.log(chunk);
    });
    return req.on("end", () => {
      const toParse = Buffer.concat(body).toString();
      message = toParse.split("=")[1];
      fs.writeFile("text.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title> My page </title></head>");
  res.write("<body> <h1> MY page!!! </h1> </body>");
  res.write("</html>");
  res.end();
};

module.exports = requestHandler;
