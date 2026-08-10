const tabelaProdutos = document.getElementById('tabelaProdutos');

let produtosCache = [];

function renderTabela(produtos) {
    if (produtos.length === 0) {
        tabelaProdutos.innerHTML = '<tr class="empty-row"><td colspan="8">Nenhum produto cadastrado</td></tr>';
        return;
    }

    let linhas = '';
    produtos.forEach(p => {
        linhas += `
            <tr>
                <td>${p.codProduto}</td>
                <td>${p.nome}</td>
                <td>${p.categoria}</td>
                <td>${p.marca}</td>
                <td>R$ ${Number(p.preco).toFixed(2)}</td>
                <td>${p.percentualDesconto}%</td>
                <td>${p.quantidade}</td>
                <td>
                    <a href="produto-editar.html?id=${p.codProduto}"><button class="btn-primary btn-sm">Editar</button></a>
                    <button class="btn-danger btn-sm" onclick="excluirProduto(${p.codProduto})">Excluir</button>
                </td>
            </tr>
        `;
    });
    tabelaProdutos.innerHTML = linhas;
}

function carregarProdutos() {
    fetch('http://localhost:3000/produtos/listar')
    .then(res => res.json())
    .then(dados => {
        produtosCache = dados.getProduto;
        renderTabela(produtosCache);
    })
    .catch(err => {
        console.error('Erro ao listar produtos:', err);
        tabelaProdutos.innerHTML = '<tr class="empty-row"><td colspan="8">Erro ao carregar produtos</td></tr>';
    });
}

function excluirProduto(id) {
    if (!confirm('Deseja realmente excluir este produto?')) return;

    let ok = false;

    fetch(`http://localhost:3000/produtos/apagar/${id}`, {
        method: 'DELETE'
    })
    .then(res => {
        ok = res.ok;
        return res.json();
    })
    .then(dados => {
        if (!ok) {
            console.error('Erro ao excluir produto:', dados.message);
            return;
        }
        carregarProdutos();
    })
    .catch(err => {
        console.error('Erro ao excluir produto:', err);
    });
}

document.getElementById('btnBuscar').addEventListener('click', () => {
    const id = document.getElementById('buscaId').value.trim();
    if (!id) return;

    fetch(`http://localhost:3000/produtos/consultarPorPk/${id}`)
    .then(res => res.json())
    .then(dados => {
        renderTabela(dados.getProduto ? [dados.getProduto] : []);
    })
    .catch(err => {
        console.error('Erro ao buscar produto:', err);
        renderTabela([]);
    });
});

document.getElementById('btnLimparBusca').addEventListener('click', () => {
    document.getElementById('buscaId').value = '';
    renderTabela(produtosCache);
});

carregarProdutos();
