const formUsuario = document.getElementById('formUsuario');
const idUsuario = new URLSearchParams(window.location.search).get('id');

function preencherForm(usuario) {
    document.getElementById('codUsuario').value = usuario.codUsuario;
    document.getElementById('nome').value = usuario.nome;
    document.getElementById('sobrenome').value = usuario.sobrenome;
    document.getElementById('idade').value = usuario.idade;
    document.getElementById('email').value = usuario.email;
    document.getElementById('telefone').value = usuario.telefone;
    document.getElementById('endereco').value = usuario.endereco;
    document.getElementById('cidade').value = usuario.cidade;
    document.getElementById('estado').value = usuario.estado;
}

function carregarUsuario() {
    if (!idUsuario) {
        console.error('Nenhum usuário selecionado');
        return;
    }

    fetch(`http://localhost:3000/usuarios/consultarPorPk/${idUsuario}`)
    .then(res => res.json())
    .then(dados => {
        if (!dados.getUsuario) {
            console.error('Usuário não encontrado');
            return;
        }
        preencherForm(dados.getUsuario);
    })
    .catch(err => {
        console.error('Erro ao consultar usuário:', err);
    });
}

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

    fetch(`http://localhost:3000/usuarios/atualizar/${idUsuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    })
    .then(res => {
        ok = res.ok;
        return res.json();
    })
    .then(dados => {
        if (!ok) {
            console.error('Erro ao atualizar usuário:', dados.message);
            return;
        }
        window.location.href = 'usuarios.html';
    })
    .catch(err => {
        console.error('Erro ao atualizar usuário:', err);
    });
});

carregarUsuario();