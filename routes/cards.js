const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createCard, getCards, deleteCardById, putLike, deleteLike,
} = require('../controllers/cards');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
  }),
}), createCard);

router.get('/', getCards);
router.delete('/:id', deleteCardById);
router.put('/:id/likes', putLike);
router.delete('/:id/likes', deleteLike);

module.exports = router;
