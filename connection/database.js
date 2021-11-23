let mysql = require('mysql');

function crearConexion() {
    return mysql.createConnection(
        {
            host: '127.0.0.1',
            database: 'QuieroComer',
            user: 'root',
            password: '',
            multipleStatements: true
        }
    );
}

module.exports = {crearConexion}
