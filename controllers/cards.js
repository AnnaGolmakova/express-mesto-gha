const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Не удалось создать карточку',
        });
      }
      return res.status(500).send({
        message: 'Произошла неизвестная ошибка',
      });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({
      message: 'Не удалось получить карточки',
    }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findOneAndRemove({ _id: req.params.id })
    .then((card) => {
      if (card === null) {
        return res.status(404).send({
          message: 'Карточка не найдена',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Неправильно передан ID карточки',
        });
      }
      return res.status(500).send({
        message: 'Неизвестная ошибка',
      });
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        return res.status(404).send({
          message: 'Карточка не найдена',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Неправильно передан ID карточки',
        });
      }
      return res.status(500).send({
        message: 'Неизвестная ошибка',
      });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { likes: req.user._id },
    },

    { new: true },
  )
    .then((card) => {
      if (card === null) {
        return res.status(404).send({
          message: 'Карточка не найдена',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Неправильно передан ID карточки',
        });
      }
      return res.status(500).send({
        message: 'Неизвестная ошибка',
      });
    });
};
