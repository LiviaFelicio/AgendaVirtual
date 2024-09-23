<?php
// enviar_email.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $task = $data['task'];
    $students = $data['students'];
    
    $to = 'biacrzcampos@gmail.com'; // seu e-mail
    $subject = 'Ocorrência Escolar';
    $message = "Tarefa: $task\nAlunos:\n" . implode("\n", $students);
    $headers = 'From: no-reply@escola.com' . "\r\n";

    if (mail($to, $subject, $message, $headers)) {
        echo 'E-mail enviado com sucesso!';
    } else {
        echo 'Falha ao enviar o e-mail.';
    }
} else {
    echo 'Método não permitido.';
}
?>
