const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const users = require('./routes/users');
const cards = require('./routes/cards');

const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');
const { validateLogin, validateRegistration } = require('./middlewares/validation');
const errorHandler = require('./middlewares/error-handler');

const app = express();
const port = 3000;

const NotFoundError = require('./errors/not-found-err');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(cookieParser());

app.post('/signin', validateLogin);
app.post('/signin', login);

app.post('/signup', validateRegistration);
app.post('/signup', createUser);

app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

app.use((req, res, next) => {
  next(new NotFoundError('Неправильный запрос API'));
});

app.use(errors());
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Mesto backend app listening on port ${port}`);
});
