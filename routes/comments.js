const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddlewares');
const { getComments, createComment, deleteComment } = require('../controllers/commentsController');

router.get('/:post_id', getComments);
router.post('/:post_id', authMiddleware, createComment);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;