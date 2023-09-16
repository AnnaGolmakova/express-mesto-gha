const validator = require('validator');

const User = require('../models/user');

const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../constants');

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!validator.isEmail(email)) {
    return res.status(BAD_REQUEST).send({
      message: 'Передан неправильный email',
    });
  }

  User.create({
    name, about, avatar, email, password,
  })
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
