const router = require('express').Router();
const {
  createCard, getCards, deleteCardById, putLike, deleteLike,
} = require('../controllers/cards');

router.post('/', createCard);
router.get('/', getCards);
router.delete('/:id', deleteCardById);
router.put('/:id/likes', putLike);
router.delete('/:id/likes', deleteLike);

module.exports = router;
