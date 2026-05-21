const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddlewares');
const { uploadImages } = require('../middlewares/uploadMiddleware');
const { getPosts, getPostById, createPost, updatePost, deletePost } = require('../controllers/postsController');

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', authMiddleware, uploadImages.array('images', 10), createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;