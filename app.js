const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const adminRouter = require("./routers/admins");
const shopRouter = require("./routers/shop");
const errorController = require("./controller/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(errorController.get404Page);

// const server = http.createServer(app);
// server.listen(3000);

app.listen(3000);
