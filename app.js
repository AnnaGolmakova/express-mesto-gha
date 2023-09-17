const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
const port = 3000;

const { NOT_FOUND } = require('./constants');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

app.use((req, res) => {
  res.status(NOT_FOUND).send({
    message: 'Неправильный запрос API',
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(port, () => {
  console.log(`Mesto backend app listening on port ${port}`);
});
