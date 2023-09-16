const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getMyUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMyUser);
router.get('/:id', getUserById);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
