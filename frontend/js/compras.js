const tabelaCompras = document.getElementById('tabelaCompras');

let comprasCache = [];
let usuarios = [];
let produtos = [];

function nomeUsuario(id) {
    const usuario = usuarios.find(u => u.codUsuario === id);
    return usuario ? `${usuario.nome} ${usuario.sobrenome}` : id;
}

function nomeProduto(id) {
    const produto = produtos.find(p => p.codProduto === id);
    return produto ? produto.nome : id;
}

function renderTabela(compras) {
    if (compras.length === 0) {
        tabelaCompras.innerHTML = '<tr class="empty-row"><td colspan="10">Nenhuma compra registrada</td></tr>';
        return;
    }

    let linhas = '';
    compras.forEach(c => {
        const statusClass = c.statusCompra === 'PAGA' ? 'badge-green' : 'badge-gray';
        linhas += `
            <tr>
                <td>${c.codCompra}</td>
                <td>${nomeUsuario(c.idUsuario)}</td>
                <td>${nomeProduto(c.idProduto)}</td>
                <td>${c.tipo}</td>
                <td>${c.qtdeMov}</td>
                <td>R$ ${Number(c.precoFinal).toFixed(2)}</td>
                <td>${c.formaPagamento}</td>
                <td><span class="badge ${statusClass}">${c.statusCompra}</span></td>
                <td>${c.data}</td>
                <td>
                    <a href="compra-editar.html?id=${c.codCompra}"><button class="btn-primary btn-sm">Editar</button></a>
                    <button class="btn-danger btn-sm" onclick="excluirCompra(${c.codCompra})">Excluir</button>
                </td>
            </tr>
        `;
    });
    tabelaCompras.innerHTML = linhas;
}

function carregarCompras() {
    fetch('http://localhost:3000/compras/listar')
    .then(res => res.json())
    .then(dados => {
        comprasCache = dados.getCompra;
        renderTabela(comprasCache);
    })
    .catch(err => {
        console.error('Erro ao listar compras:', err);
        tabelaCompras.innerHTML = '<tr class="empty-row"><td colspan="10">Erro ao carregar compras</td></tr>';
    });
}

function carregarReferencias() {
    return fetch('http://localhost:3000/usuarios/listar')
    .then(res => res.json())
    .then(dados => {
        usuarios = dados.getUsuario;
        return fetch('http://localhost:3000/produtos/listar');
    })
    .then(res => res.json())
    .then(dados => {
        produtos = dados.getProduto;
    })
    .catch(err => {
        console.error('Erro ao carregar usuários e produtos:', err);
    });
}

function excluirCompra(id) {
    if (!confirm('Deseja realmente excluir esta compra?')) return;

    let ok = false;

    fetch(`http://localhost:3000/compras/apagar/${id}`, { method: 'DELETE' })
    .then(res => {
        ok = res.ok;
        return res.json();
    })
    .then(dados => {
        if (!ok) {
            console.error('Erro ao excluir compra:', dados.message);
            return;
        }
        carregarCompras();
    })
    .catch(err => {
        console.error('Erro ao excluir compra:', err);
    });
}

document.getElementById('btnBuscar').addEventListener('click', () => {
    const id = document.getElementById('buscaId').value.trim();
    if (!id) return;

    fetch(`http://localhost:3000/compras/consultarPorPk/${id}`)
    .then(res => res.json())
    .then(dados => {
        renderTabela(dados.getCompra ? [dados.getCompra] : []);
    })
    .catch(err => {
        console.error('Erro ao buscar compra:', err);
        renderTabela([]);
    });
});

document.getElementById('btnLimparBusca').addEventListener('click', () => {
    document.getElementById('buscaId').value = '';
    renderTabela(comprasCache);
});

carregarReferencias().then(() => carregarCompras());
