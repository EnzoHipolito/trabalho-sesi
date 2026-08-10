const formUsuario = document.getElementById('formUsuario');

formUsuario.addEventListener('submit', (e) => {
    e.preventDefault();

    const usuario = {
        nome: document.getElementById('nome').value,
        sobrenome: document.getElementById('sobrenome').value,
        idade: Number(document.getElementById('idade').value),
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value
    };

    let ok = false;

    fetch('http://localhost:3000/usuarios/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    })
    .then(res => {
        ok = res.ok;
        return res.json();
    })
    .then(dados => {
        if (!ok) {
            console.error('Erro ao cadastrar usuário:', dados.message);
            return;
        }
        window.location.href = 'usuarios.html';
    })
    .catch(err => {
        console.error('Erro ao cadastrar usuário:', err);
    });
});