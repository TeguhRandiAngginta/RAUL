import express from 'express';
import { authenticateToken } from '../configs/middleware.js';
import { createReview, getReviewsForMovie, getMyReviews, updateReview, deleteReview, getMovieRatingStats } from '../controllers/review.controller.js';

const router = express.Router();

// Endpoint untuk membuat review
router.post('/', authenticateToken, createReview);


// Endpoint untuk mengambil semua review milik user yang sedang login
router.get('/my-reviews', authenticateToken, getMyReviews);

// Endpoint untuk mengambil statistik rating sebuah movie
router.get('/stats/:movieId', getMovieRatingStats);

// Endpoint untuk mengambil review 1 film
router.get('/movie/:movieId', getReviewsForMovie);

// Endpoint untuk mengupdate review
router.put('/:id', authenticateToken, updateReview);

// Endpoint untuk menghapus review
router.delete('/:id', authenticateToken, deleteReview);


export default router;