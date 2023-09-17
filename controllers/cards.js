const Card = require('../models/card');

const {
  BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, UNAUTHORIZED,
} = require('../constants');

const NotFoundError = require('../errors/not-found-err');
const InternalServerError = require('../errors/internal-server-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные в методы создания карточки'));
      }
      return next(new InternalServerError('Произошла неизвестная ошибка'));
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => next(new InternalServerError('Не удалось получить карточки')));
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findOne({ _id: req.params.id })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new UnauthorizedError('У вас нет прав на удаление этой карточки');
      }
      card.deleteOne();
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неправильно передан ID карточки'));
      }
      return next(new InternalServerError('Неизвестная ошибка'));
    });
};

module.exports.putLike = (req, res, next) => {
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
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неправильно передан ID карточки'));
      }
      return next(new InternalServerError('Неизвестная ошибка'));
    });
};

module.exports.deleteLike = (req, res, next) => {
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
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неправильно передан ID карточки'));
      }
      return next(new InternalServerError('Неизвестная ошибка'));
    });
};
