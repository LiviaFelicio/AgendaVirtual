const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const qs = require('querystring');

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do session middleware
app.use(session({
    secret: 'segredo', // Troque por uma chave segura em produção
    resave: false,
    saveUninitialized: true
}));

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'professor1', // Substitua pelo seu usuário do MySQL
    password: 'senha1', // Substitua pela sua senha do MySQL
    database: 'meu_banco_de_dados' // Substitua pelo nome do seu banco de dados
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rota para a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota para a página de turmas
app.get('/turmas', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'turmas.html'));
    } else {
        res.redirect('/login');
    }
});

// Rota para login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM professores WHERE login = ? AND senha = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.status(500).send('Erro ao autenticar');
        }
        if (results.length > 0) {
            req.session.user = results[0];
            res.redirect('/turmas');
        } else {
            res.send('Usuário ou senha incorretos');
        }
    });
});

// Rota para a página de publicar
app.get('/publicar', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'publicar.html'));
    } else {
        res.redirect('/login');
    }
});

// Rota para publicar atividades
app.post('/publicar', (req, res) => {
    let body = '';
    
    // Recebe dados do corpo da requisição
    req.on('data', chunk => {
        body += chunk.toString();
        if (body.length > 1e6) {
            req.connection.destroy(); // Previne ataques de flood
        }
    });

    req.on('end', () => {
        const POST = qs.parse(body);
        const { data_entrega, materia, conteudo, detalhes } = POST;

        console.log('Dados recebidos:', { data_entrega, materia, conteudo, detalhes }); // Para depuração

        const query = 'INSERT INTO tarefas (data_entrega, turma, descricao, detalhes) VALUES (?, ?, ?, ?)';
        const turma = "Turma Exemplo"; // Substitua pelo valor apropriado

        db.query(query, [data_entrega, turma, conteudo, detalhes], (err) => {
            if (err) {
                console.error('Erro ao inserir a tarefa:', err);
                return res.status(500).send('Erro ao publicar a tarefa');
            }
            res.redirect('/turmas'); // Redireciona após a publicação
        });
    });
});

// Rota para a página de ocorrências
app.get('/ocorrencia', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'ocorrencia.html'));
    } else {
        res.redirect('/login');
    }
});

// Rota para buscar tarefas
app.get('/tarefas', (req, res) => {
    const query = 'SELECT id_tarefa, descricao, data_entrega FROM tarefas'; // Inclui descrição
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao consultar tarefas:', err);
            return res.status(500).send('Erro ao buscar tarefas');
        }
        res.json(results); // Retorna as tarefas em formato JSON
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});










