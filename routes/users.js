const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  getMyUser,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/me', getMyUser);
router.get('/:id', getUserById);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
