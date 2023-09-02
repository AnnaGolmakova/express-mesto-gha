const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(400).send({
      message: 'Не удалось создать пользователя',
    }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(404).send({
      message: 'Пользователи не найдены',
    }));
};

module.exports.getUserById = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(404).send({
      message: 'Пользователь не найден',
    }));
};
