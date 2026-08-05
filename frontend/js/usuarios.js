const tabelaUsuarios = document.getElementById('tabelaUsuarios');
const modalOverlay = document.getElementById('modalOverlay');
const formUsuario = document.getElementById('formUsuario');
const modalTitulo = document.getElementById('modalTitulo');

let usuariosCache = [];

function showAlert(message, type = 'success') {
    const el = document.getElementById('alertBox');
    el.textContent = message;
    el.className = `alert show alert-${type}`;
    setTimeout(() => {
        el.className = 'alert';
    }, 4000);
}

function abrirModal(usuario = null) {
    formUsuario.reset();
    if (usuario) {
        modalTitulo.textContent = 'Editar Usuário';
        document.getElementById('codUsuario').value = usuario.codUsuario;
        document.getElementById('nome').value = usuario.nome;
        document.getElementById('sobrenome').value = usuario.sobrenome;
        document.getElementById('idade').value = usuario.idade;
        document.getElementById('email').value = usuario.email;
        document.getElementById('telefone').value = usuario.telefone;
        document.getElementById('endereco').value = usuario.endereco;
        document.getElementById('cidade').value = usuario.cidade;
        document.getElementById('estado').value = usuario.estado;
    } else {
        modalTitulo.textContent = 'Novo Usuário';
        document.getElementById('codUsuario').value = '';
    }
    modalOverlay.classList.add('open');
}

function fecharModal() {
    modalOverlay.classList.remove('open');
}

function renderTabela(usuarios) {
    if (usuarios.length === 0) {
        tabelaUsuarios.innerHTML = '<tr class="empty-row"><td colspan="8">Nenhum usuário cadastrado</td></tr>';
        return;
    }

    let linhas = '';
    usuarios.forEach(u => {
        linhas += `
            <tr>
                <td>${u.codUsuario}</td>
                <td>${u.nome} ${u.sobrenome}</td>
                <td>${u.idade}</td>
                <td>${u.email}</td>
                <td>${u.telefone}</td>
                <td>${u.cidade}</td>
                <td>${u.estado}</td>
                <td>
                    <button class="btn-primary btn-sm" onclick="editarUsuario(${u.codUsuario})">Editar</button>
                    <button class="btn-danger btn-sm" onclick="excluirUsuario(${u.codUsuario})">Excluir</button>
                </td>
            </tr>
        `;
    });
    tabelaUsuarios.innerHTML = linhas;
}

function carregarUsuarios() {
    fetch('http://localhost:3000/usuarios/listar')
    .then(res => res.json())
    .then(dados => {
        usuariosCache = dados.getUsuario;
        renderTabela(usuariosCache);
    })
    .catch(err => {
        console.error('Erro ao listar usuários:', err);
        tabelaUsuarios.innerHTML = '<tr class="empty-row"><td colspan="8">Erro ao carregar usuários</td></tr>';
    });
}

function editarUsuario(id) {
    fetch(`http://localhost:3000/usuarios/consultarPorPk/${id}`)
    .then(res => res.json())
    .then(dados => {
        if (!dados.getUsuario) {
            showAlert('Usuário não encontrado', 'error');
            return;
        }
        abrirModal(dados.getUsuario);
    })
    .catch(err => {
        console.error('Erro ao consultar usuário:', err);
        showAlert('Erro ao consultar usuário', 'error');
    });
}

function excluirUsuario(id) {
    if (!confirm('Deseja realmente excluir este usuário?')) return;

    let ok = false;

    fetch(`http://localhost:3000/usuarios/apagar/${id}`, {
        method: 'DELETE' 
    })
    .then(res => {
        ok = res.ok;
        return res.json();
    })
    .then(dados => {
        if (!ok) {
            showAlert(dados.message, 'error');
            return;
        }
        showAlert(dados.message, 'success');
        carregarUsuarios();
    })
    .catch(err => {
        console.error('Erro ao excluir usuário:', err);
        showAlert('Erro ao excluir usuário', 'error');
    });
}

document.getElementById('btnNovo').addEventListener('click', () => abrirModal());
document.getElementById('btnCancelar').addEventListener('click', fecharModal);

formUsuario.addEventListener('submit', (e) => {
    e.preventDefault();

    const cod = document.getElementById('codUsuario').value;
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

    const url = cod
        ? `http://localhost:3000/usuarios/atualizar/${cod}`
        : 'http://localhost:3000/usuarios/cadastrar';

    let ok = false;

    fetch(url, {
        method: cod ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    })
    .then(res => {
        ok = res.ok;
        return res.json();
    })
    .then(dados => {
        if (!ok) {
            showAlert(dados.message, 'error');
            return;
        }
        showAlert(dados.message, 'success');
        fecharModal();
        carregarUsuarios();
    })
    .catch(err => {
        console.error('Erro ao salvar usuário:', err);
        showAlert('Erro ao salvar usuário', 'error');
    });
});

document.getElementById('btnBuscarId').addEventListener('click', () => {
    const id = document.getElementById('buscaId').value.trim();
    if (!id) return;

    fetch(`http://localhost:3000/usuarios/consultarPorPk/${id}`)
    .then(res => res.json())
    .then(dados => {
        renderTabela(dados.getUsuario ? [dados.getUsuario] : []);
    })
    .catch(err => {
        console.error('Erro ao buscar usuário por id:', err);
        renderTabela([]);
    });
});

document.getElementById('btnBuscarNome').addEventListener('click', () => {
    const nome = document.getElementById('buscaNome').value.trim();
    if (!nome) return;

    fetch(`http://localhost:3000/usuarios/consultarPorNome/${nome}`)
    .then(res => res.json())
    .then(dados => {
        renderTabela(dados.getUsuario ? [dados.getUsuario] : []);
    })
    .catch(err => {
        console.error('Erro ao buscar usuário por nome:', err);
        renderTabela([]);
    });
});

document.getElementById('btnLimparBusca').addEventListener('click', () => {
    document.getElementById('buscaId').value = '';
    document.getElementById('buscaNome').value = '';
    renderTabela(usuariosCache);
});

carregarUsuarios();
