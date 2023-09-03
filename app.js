const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/users');
const cards = require('./routes/cards');

const app = express();
const port = 3000;

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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/users', users);
app.use('/cards', cards);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
