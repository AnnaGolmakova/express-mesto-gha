const User = require('../models/user');

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Не удалось создать пользователя',
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
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
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
  this.updateUserInfo(req, res);
};
