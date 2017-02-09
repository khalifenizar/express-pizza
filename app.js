var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const cors = require('cors')

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public

app.use(cors())

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

const ingredientsDb = [
  { id: 1, name: 'Bacon', price: 1, calories: 90 },     //0
  { id: 2, name: 'Croquetas', price: 2, calories: 190 },
  { id: 3, name: 'Pepperoni', price: 1, calories: 90 },  //2
  { id: 4, name: 'Mushrooms', price: 1, calories: 40 },
  { id: 5, name: 'Onions', price: 1, calories: 40 },
  { id: 6, name: 'Donuts', price: 2, calories: 200 },
  { id: 7, name: 'Nutella', price: 2, calories: 100 },
  { id: 8, name: 'Salami', price: 50, calories: 150 },  // 7
]

const pizzaDealsDb = [
  { id: 1, name: 'Create Your Own', basePrice: 10, ingredients: [], image: '/assets/create-your-own.jpg' },
  { id: 2, name: `Angelo's Pie`, basePrice: 10, ingredients: ingredientsDb.slice(5), image: '/assets/angelos-pie.jpg' },
  { id: 3, name: 'Your Last Meat Pie', basePrice: 10, ingredients: ingredientsDb.slice(0, 3), image: '/assets/last-meat-pie.jpg' },
  { id: 4, name: `Elias' Meat Lovers Pizza`, basePrice: 900, ingredients: [ingredientsDb[0], ingredientsDb[2], ingredientsDb[7]], image: 'https://media.giphy.com/media/85P6sWWBgWg6Y/giphy.gif' }
]

const sessionCart = []


app.get('/api/pizza-deals', function (req, res, next) {
  res.send(pizzaDealsDb)
})

app.post('/api/add-to-cart', function (req, res, next) {
  sessionCart.push(req.body.pizzaDealId)
  res.send({ status: 'success. good job.' })
})

app.get('/api/cart', function (req, res, next) {
  const sessionDeals = sessionCart.map(dealId => {
    return pizzaDealsDb.find(deal => deal.id === dealId)
  })
  res.send(sessionDeals)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
