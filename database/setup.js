// database/setup.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// O arquivo do banco de dados será criado na raiz do projeto como 'database.db'
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error("Erro ao abrir o banco de dados", err.message);
    } else {
        console.log("Conectado ao banco de dados SQLite.");
        initializeDB();
    }
});

function initializeDB() {
    db.serialize(() => {
        // Cria a tabela de usuários se ela não existir
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error("Erro ao criar tabela 'users'", err.message);
                return;
            }
            console.log("Tabela 'users' verificada/criada com sucesso.");

            // Gera o hash da senha para o usuário de exemplo
            const plainPassword = 'senha123';
            bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
                if (err) {
                    console.error("Erro ao gerar hash da senha", err);
                    return;
                }

                // Insere um usuário de exemplo APENAS se o email ainda não existir
                const insert = `INSERT INTO users (name, email, password) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = ?)`;
                const userEmail = 'usuario@exemplo.com';

                db.run(insert, ["Usuário de Teste", userEmail, hashedPassword, userEmail], function(err) {
                    if (err) {
                        console.error("Erro ao inserir usuário de exemplo", err.message);
                    } else if (this.changes > 0) {
                        console.log(`Usuário de exemplo inserido com sucesso!`);
                        console.log(`Email: ${userEmail}`);
                        console.log(`Senha: ${plainPassword}`);
                    } else {
                        console.log("Usuário de exemplo já existe no banco de dados.");
                    }
                    
                    // Fecha a conexão com o banco
                    db.close((err) => {
                        if (err) {
                            console.error(err.message);
                        }
                        console.log('Conexão com o banco de dados fechada.');
                    });
                });
            });
        });
    });
}

