const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddlewares');
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/usersController');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;