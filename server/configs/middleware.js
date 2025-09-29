import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.taskly_token || req.header('Authorization')?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.AUTH_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // Menyimpan role dan id
        next();
    });
};

export const errorHandler = (err, req, res, next) => {
    const defaultMessage = "We're having technical issues. Please try again later";
    const { status, message, error } = err;
    if (error) {
        console.log(error);
    }
    res.status(status).json({ message: message || defaultMessage });
};
