import express from 'express';
import { authenticateToken } from '../configs/middleware.js';
import { createReview, getReviewsForMovie, getMyReviews } from '../controllers/review.controller.js';

const router = express.Router();

// Endpoint untuk membuat review
router.post('/', authenticateToken, createReview);

// Endpoint untuk mengambil review 1 film
router.get('/movie/:movieId', getReviewsForMovie);

// Endpoint untuk mengambil semua review milik user yang sedang login
router.get('/my-reviews', authenticateToken, getMyReviews);

export default router;