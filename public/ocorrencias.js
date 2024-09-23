document.getElementById('send-button').addEventListener('click', function() {
    const checkboxes = document.querySelectorAll('input[name="student"]:checked');
    const selectedStudents = Array.from(checkboxes).map(cb => cb.value);

    if (selectedStudents.length > 0) {
        const task = document.getElementById('task-select').value;
        const message = `Deseja enviar um e-mail alertando o ocorrido para os pais/responsáveis dos seguintes alunos:\n\n${selectedStudents.join('\n')}`;

        if (confirm(message)) {
            fetch('/enviar-ocorrencia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    task: task,
                    students: selectedStudents
                })
            })
            .then(response => response.text())
            .then(data => {
                alert(data);
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao enviar e-mail.');
            });
        }
    } else {
        alert('Nenhum aluno selecionado.');
    }
});




