import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../configs/db.js';
import { sendEmail } from '../utils/sendEmail.js';
import { ObjectId } from 'mongodb';

const collection = db.collection('users');

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const query = {
            $or: [{ email }, { username }],
        };
        const existingUser = await collection.findOne(query);
        if (existingUser) {
            if (!existingUser.isVerified) {
                return next({
                    status: 400,
                    message: 'Email ini sudah terdaftar tapi belum diverifikasi. Cek email Anda.',
                });
            }
            return next({
                status: 422,
                message: 'Email or Username is already registered.',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            username,
            email,
            password: hashedPassword,
            role: 'customer',
            watchlist: [],
            isVerified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        
        const { insertedId } = await collection.insertOne(user);
        // --- KIRIM EMAIL VERIFIKASI ---
        // 1. Buat token verifikasi (berlaku 1 jam)
        const verificationToken = jwt.sign(
            { id: insertedId, purpose: 'verify-email' },
            process.env.AUTH_SECRET,
            { expiresIn: '1h' }
        );

        // 2. Buat Link Verifikasi
        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

        // 3. Konten Email (HTML)
        const emailHtml = `
            <h1>Selamat Datang di Raul Film!</h1>
            <p>Satu langkah lagi untuk mengaktifkan akun Anda. Silakan klik link di bawah ini:</p>
            <a href="${verificationLink}" style="padding: 10px 15px; background-color: #ffc107; color: #000; text-decoration: none; border-radius: 5px;">
                Verifikasi Email Saya
            </a>
            <p>Link ini hanya berlaku selama 1 jam.</p>
        `;

        // 4. Kirim Email
        await sendEmail(email, "Verifikasi Akun Raul Film Anda", emailHtml);
        
        // --- SELESAI KIRIM EMAIL ---

        // const token = jwt.sign({ id: insertedId, role: user.role }, process.env.AUTH_SECRET);
        // user._id = insertedId;
        // const { password: pass, updatedAt, createdAt, ...rest } = user;
        // res
        //     .cookie('raul_token', token, { httpOnly: true })
        //     .status(200)
        //     .json(rest);

        res.status(201).json({ 
            message: 'Pendaftaran berhasil. Silakan cek email Anda untuk verifikasi.' 
        });
    } catch (error) {
        next({ status: 500, error });
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            return next({ status: 400, message: 'Token tidak ditemukan' });
        }

        let payload;
        try {
            // Verifikasi token
            payload = jwt.verify(token, process.env.AUTH_SECRET);
        } catch (err) {
            return next({ status: 401, message: 'Token tidak valid atau kedaluwarsa' });
        }

        // Pastikan token ini untuk verifikasi email
        if (payload.purpose !== 'verify-email') {
            return next({ status: 401, message: 'Token tidak valid' });
        }

        // Cari user
        const user = await collection.findOne({ _id: new ObjectId(payload.id) });
        if (!user) {
            return next({ status: 404, message: 'User tidak ditemukan' });
        }
        if (user.isVerified) {
            return res.status(200).json({ message: 'Email sudah diverifikasi. Silakan login.' });
        }

        // Update user menjadi terverifikasi
        await collection.updateOne(
            { _id: new ObjectId(payload.id) },
            { $set: { isVerified: true, updatedAt: new Date().toISOString() } }
        );

        res.status(200).json({ message: 'Email berhasil diverifikasi! Silakan login.' });

    } catch (error) {
        next({ status: 500, error });
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await collection.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next({ status: 401, message: 'Email atau password salah' });
        }
        // --- TAMBAHAN VALIDASI ---
        if (!user.isVerified) {
            return next({ 
                status: 403, 
                message: 'Akun Anda belum diverifikasi. Silakan cek email Anda.' 
            });
        }
        // --- SELESAI VALIDASI ---

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.AUTH_SECRET);
        const { username } = user;
        res
            .cookie('raul_token', token, { httpOnly: true, path: '/' })
            .status(200)
            .json({ username });
    } catch (error) {
        next({ status: 500, error });
    }
};

export const logout = async (req, res, next) => {
    try {
        res
        .clearCookie('raul_token', {
            path: '/',
        })
        .status(200)
        .json({ message: 'Logout berhasil' });
    } catch (error) {
        next({ status: 500, error });
    }
};