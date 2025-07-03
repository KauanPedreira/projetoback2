// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar template engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos (CSS, imagens) da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares para processar dados de formulário e cookies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuração da Sessão
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Cookie dura 1 dia
    }
}));

// Usar as rotas de autenticação
app.use('/', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});