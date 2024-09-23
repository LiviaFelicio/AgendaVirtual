const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página de ocorrências
app.get('/ocorrencias', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ocorrencia.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/mural', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mural.html'));
});
app.get('/publicar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'publicar.html'));
});
app.post('/turmas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'turmas.html'));
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




