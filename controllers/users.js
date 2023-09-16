const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const {
  BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, UNAUTHORIZED,
} = require('../constants');

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (email && !validator.isEmail(email)) {
    return res.status(BAD_REQUEST).send({
      message: 'Передан неправильный email',
    });
  }

  if (password) {
    return res.status(BAD_REQUEST).send({
      message: 'Введите пароль',
    });
  }

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные в методы создания пользователя',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла неизвестная ошибка',
      });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({
      message: 'Не удалось получить пользователей',
    }));
};

module.exports.getUserById = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (user === null) {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Неправильно передан ID пользователя',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Не удалось получить данные о пользователе',
      });
    });
};

module.exports.getMyUser = (req, res) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (user === null) {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Неправильно передан ID пользователя',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Не удалось получить данные о пользователе',
      });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (user === null) {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Неправильно переданы данные',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (user === null) {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Неправильно переданы данные',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return [bcrypt.compare(password, user.password), user];
    })
    .then(([matched, user]) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      return res
        .cookie('token', token, { httpOnly: true })
        .send({ message: 'Logged in successfully 😊 👌' });
    })
    .catch((err) => {
      res
        .status(UNAUTHORIZED)
        .send({ message: err.message });
    });
};
