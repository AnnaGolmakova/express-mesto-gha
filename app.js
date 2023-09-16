const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const app = express();
const port = 3000;

const { NOT_FOUND } = require('./constants');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64f481133f512f4375bfb179',
  };

  next();
});

app.use('/users', users);
app.use('/cards', cards);

app.post('/signin', login);
app.post('/signup', createUser);

app.use((req, res) => {
  res.status(NOT_FOUND).send({
    message: 'Неправильный запрос API',
  });
});

app.listen(port, () => {
  console.log(`Mesto backend app listening on port ${port}`);
});
