const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const adminRouter = require('./routers/admins');
const shopRouter = require('./routers/shop');
const errorController = require('./controller/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.hasMany(CartItem);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  .sync({ force: true })
  //   .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'testUser', email: 'testEmail' });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then(() => {
    app.use((req, res, next) => {
      User.findByPk(1)
        .then((user) => {
          req.user = user;
          next();
        })
        .catch((err) => {
          console.log(err);
        });
    });

    app.use('/admin', adminRouter);
    app.use(shopRouter);
    app.use(errorController.get404Page);

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
