// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Middleware para proteger rotas
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};

router.get('/', (req, res) => res.redirect('/login'));
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/dashboard', isAuthenticated, authController.getDashboard);
router.get('/logout', authController.getLogout);

module.exports = router;