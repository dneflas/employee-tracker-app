const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'SQLUserPass1#',
        database: 'employee_db'
    },
    console.log('Connected to the employee database.')
);

module.exports = db;