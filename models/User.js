// models/User.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

class User {
    static findByEmail(email, callback) {
        const query = `SELECT * FROM users WHERE email = ?`;
        db.get(query, [email], (err, row) => {
            callback(err, row);
        });
    }
}

module.exports = User;