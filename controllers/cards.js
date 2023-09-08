const Card = require('../models/card');

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Не удалось создать карточку',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла неизвестная ошибка',
      });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({
      message: 'Не удалось получить карточки',
    }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findOneAndRemove({ _id: req.params.id })
    .then((card) => {
      if (card === null) {
        return res.status(NOT_FOUND).send({
          message: 'Карточка не найдена',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Неправильно передан ID карточки',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
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
    .populate('likes')
    .then((card) => {
      if (card === null) {
        return res.status(NOT_FOUND).send({
          message: 'Карточка не найдена',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Неправильно передан ID карточки',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
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
    .populate('likes')
    .then((card) => {
      if (card === null) {
        return res.status(NOT_FOUND).send({
          message: 'Карточка не найдена',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Неправильно передан ID карточки',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Неизвестная ошибка',
      });
    });
};
