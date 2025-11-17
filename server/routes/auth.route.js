import express from 'express';
import {
    signup, login, logout, verifyEmail, resendVerification
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login', login);
router.post('/logout', logout);

export default router;