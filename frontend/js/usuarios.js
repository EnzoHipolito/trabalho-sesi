const tabelaUsuarios = document.getElementById('tabelaUsuarios');
const modalOverlay = document.getElementById('modalOverlay');
const formUsuario = document.getElementById('formUsuario');
const modalTitulo = document.getElementById('modalTitulo');

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

    tabelaUsuarios.innerHTML = usuarios.map(u => `
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
    `).join('');
}

let usuariosCache = [];

async function carregarUsuarios() {
    try {
        usuariosCache = await Api.usuarios.listar();
        renderTabela(usuariosCache);
    } catch (err) {
        tabelaUsuarios.innerHTML = `<tr class="empty-row"><td colspan="8">Erro: ${err.message}</td></tr>`;
    }
}

async function editarUsuario(id) {
    try {
        const usuario = await Api.usuarios.consultarPorPk(id);
        abrirModal(usuario);
    } catch (err) {
        showAlert('alertBox', err.message, 'error');
    }
}

async function excluirUsuario(id) {
    if (!confirm('Deseja realmente excluir este usuário?')) return;
    try {
        await Api.usuarios.apagar(id);
        showAlert('alertBox', 'Usuário excluído com sucesso!', 'success');
        carregarUsuarios();
    } catch (err) {
        showAlert('alertBox', err.message, 'error');
    }
}

document.getElementById('btnNovo').addEventListener('click', () => abrirModal());
document.getElementById('btnCancelar').addEventListener('click', fecharModal);

formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cod = document.getElementById('codUsuario').value;
    const dados = {
        nome: document.getElementById('nome').value,
        sobrenome: document.getElementById('sobrenome').value,
        idade: Number(document.getElementById('idade').value),
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value
    };

    try {
        if (cod) {
            await Api.usuarios.atualizar(cod, dados);
            showAlert('alertBox', 'Usuário atualizado com sucesso!', 'success');
        } else {
            await Api.usuarios.cadastrar(dados);
            showAlert('alertBox', 'Usuário cadastrado com sucesso!', 'success');
        }
        fecharModal();
        carregarUsuarios();
    } catch (err) {
        showAlert('alertBox', err.message, 'error');
    }
});

document.getElementById('btnBuscarId').addEventListener('click', async () => {
    const id = document.getElementById('buscaId').value.trim();
    if (!id) return;
    try {
        const usuario = await Api.usuarios.consultarPorPk(id);
        renderTabela(usuario ? [usuario] : []);
    } catch (err) {
        renderTabela([]);
    }
});

document.getElementById('btnBuscarNome').addEventListener('click', async () => {
    const nome = document.getElementById('buscaNome').value.trim();
    if (!nome) return;
    try {
        const usuario = await Api.usuarios.consultarPorNome(nome);
        renderTabela(usuario ? [usuario] : []);
    } catch (err) {
        renderTabela([]);
    }
});

document.getElementById('btnLimparBusca').addEventListener('click', () => {
    document.getElementById('buscaId').value = '';
    document.getElementById('buscaNome').value = '';
    renderTabela(usuariosCache);
});

carregarUsuarios();
