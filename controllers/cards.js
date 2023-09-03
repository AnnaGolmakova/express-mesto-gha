const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch(() => res.status(400).send({
      message: 'Не удалось создать карточку',
    }));
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(404).send({
      message: 'Карточки не найдены',
    }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findOneAndRemove({ _id: req.params.id })
    .then((card) => res.send(card))
    .catch(() => res.status(404).send({
      message: 'Карточка не найдена',
    }));
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch(() => res.status(404).send({
      message: 'Карточка не найдена',
    }));
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch(() => res.status(404).send({
      message: 'Карточка не найдена',
    }));
};
