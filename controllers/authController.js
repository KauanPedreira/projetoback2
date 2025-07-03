// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
    // Passa a variável de erro para a view, se existir (após um redirect)
    res.render('login', { error: req.session.error });
    // Limpa o erro da sessão para não aparecer novamente
    delete req.session.error; 
};

exports.postLogin = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, user) => {
        if (err || !user) {
            req.session.error = 'Email ou senha inválidos.';
            return res.redirect('/login');
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                req.session.error = 'Email ou senha inválidos.';
                return res.redirect('/login');
            }

            // Armazena dados do usuário na sessão, exceto a senha
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            res.redirect('/dashboard');
        });
    });
};

exports.getDashboard = (req, res) => {
    res.render('dashboard', { user: req.session.user });
};

exports.getLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid'); // Limpa o cookie da sessão
        res.redirect('/login');
    });
};