const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Не удалось создать пользователя',
        });
      }
      return res.status(500).send({
        message: 'Произошла неизвестная ошибка',
      });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({
      message: 'Не удалось получить пользователей',
    }));
};

module.exports.getUserById = (req, res) => {
  User.findOne({ _id: req.param._id })
    .then((user) => {
      if (user === null) {
        return res.status(404).send({
          message: 'Пользователь не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Неправильно передан ID пользователя',
        });
      }
      return res.status(500).send({
        message: 'Не удалось получить данные о пользователе',
      });
    });
};

module.exports.getMyUser = (req, res) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (user === null) {
        return res.status(404).send({
          message: 'Пользователь не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Неправильно передан ID пользователя',
        });
      }
      return res.status(500).send({
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
        return res.status(404).send({
          message: 'Пользователь не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Неправильно переданы данные',
        });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  this.updateUserInfo(req, res);
};
