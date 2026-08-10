const tabelaUsuarios = document.getElementById('tabelaUsuarios');

let usuariosCache = [];

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
                    <a href="usuario-editar.html?id=${u.codUsuario}"><button class="btn-primary btn-sm">Editar</button></a>
                    <button class="btn-danger btn-sm" onclick="excluirUsuario(${u.codUsuario})">Excluir</button>
                </td>
            </tr>
        `;
    });
    tabelaUsuarios.innerHTML = linhas;
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
            console.error('Erro ao excluir usuário:', dados.message);
            return;
        }
        carregarUsuarios();
    })
    .catch(err => {
        console.error('Erro ao excluir usuário:', err);
    });
}

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
        console.log(dados)
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