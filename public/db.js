const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost:3000/login', // ou o endereço do seu servidor MySQL
    user: 'seu_usuario',
    password: 'sua_senha',
    database: 'seu_banco_de_dados'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar: ' + err.stack);
        return;
    }
    console.log('Conectado como ID ' + connection.threadId);
});

module.exports = connection;
