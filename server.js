const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const mysql = require('mysql2'); // Adicione esta linha
const session = require('express-session'); // Adicione esta linha

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Adicione este middleware para processar dados do formulário

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

// Rota para a página de ocorrências
app.get('/ocorrencias', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ocorrencia.html'));
});

// Rota para a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota para a página de mural
app.get('/mural', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mural.html'));
});

// Rota para a página de publicar
app.get('/publicar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'publicar.html'));
});

// Rota para a página de turmas
app.post('/turmas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'turmas.html'));
});

// Rota para login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query para verificar se o usuário existe
    const query = 'SELECT * FROM professores WHERE login = ? AND senha = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.status(500).send('Erro ao autenticar');
        }

        // Verifica se o usuário foi encontrado
        if (results.length > 0) {
            req.session.user = results[0]; // Armazena o usuário na sessão
            res.redirect('/turmas'); // Redireciona para a página "turmas"
        } else {
            res.send('Usuário ou senha incorretos');
        }
    });
});

// Rota para enviar ocorrências
app.post('/enviar-ocorrencia', (req, res) => {
    const { task, students } = req.body;

    // Configuração do transportador
    const transporter = nodemailer.createTransport({
        service: 'gmail', // ou outro serviço de e-mail
        auth: {
            user: 'biacrzcampos@gmail.com', // seu e-mail
            pass: 'whxsveznbhqwquec' // sua senha (ou uma senha de app, se usar autenticação de dois fatores)
        }
    });

    const mailOptions = {
        from: 'biacrzcampos@gmail.com',
        to: 'beatrizdasilvacampos61@gmail.com', // email do responsável
        subject: `Ocorrência - ${task}`,
        text: `"Prezados pais ou responsáveis,

Espero que estejam bem. Estou entrando em contato para informar que o aluno/a \n\n${students.join('\n')} não realizou a entrega da tarefa designada até o momento.A realização dessa atividade é fundamental para o aprendizado e o progresso acadêmico do aluno. Caso haja alguma dificuldade ou dúvida, estamos à disposição para ajudar e discutir possíveis soluções.
Peço que incentive a regularizar essa situação o quanto antes.

Agradeço pela atenção e colaboração.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar e-mail:', error);
            return res.status(500).send('Erro ao enviar e-mail.');
        }
        console.log('E-mail enviado:', info.response);
        res.send('E-mails enviados com sucesso!');
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
