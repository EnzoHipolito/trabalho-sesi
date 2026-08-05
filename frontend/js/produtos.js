const tabelaProdutos = document.getElementById('tabelaProdutos');
const modalOverlay = document.getElementById('modalOverlay');
const formProduto = document.getElementById('formProduto');
const modalTitulo = document.getElementById('modalTitulo');

let produtosCache = [];

function showAlert(message, type = 'success') {
    const el = document.getElementById('alertBox');
    el.textContent = message;
    el.className = `alert show alert-${type}`;
    setTimeout(() => {
        el.className = 'alert';
    }, 4000);
}

function abrirModal(produto = null) {
    formProduto.reset();
    if (produto) {
        modalTitulo.textContent = 'Editar Produto';
        document.getElementById('codProduto').value = produto.codProduto;
        document.getElementById('nome').value = produto.nome;
        document.getElementById('descricao').value = produto.descricao;
        document.getElementById('categoria').value = produto.categoria;
        document.getElementById('marca').value = produto.marca;
        document.getElementById('preco').value = produto.preco;
        document.getElementById('percentualDesconto').value = produto.percentualDesconto;
        document.getElementById('quantidade').value = produto.quantidade;
        document.getElementById('imagem').value = produto.imagem;
    } else {
        modalTitulo.textContent = 'Novo Produto';
        document.getElementById('codProduto').value = '';
    }
    modalOverlay.classList.add('open');
}

function fecharModal() {
    modalOverlay.classList.remove('open');
}

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
                    <button class="btn-primary btn-sm" onclick="editarProduto(${p.codProduto})">Editar</button>
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

function editarProduto(id) {
    fetch(`http://localhost:3000/produtos/consultarPorPk/${id}`)
    .then(res => res.json())
    .then(dados => {
        if (!dados.getProduto) {
            showAlert('Produto não encontrado', 'error');
            return;
        }
        abrirModal(dados.getProduto);
    })
    .catch(err => {
        console.error('Erro ao consultar produto:', err);
        showAlert('Erro ao consultar produto', 'error');
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
            showAlert(dados.message, 'error');
            return;
        }
        showAlert(dados.message, 'success');
        carregarProdutos();
    })
    .catch(err => {
        console.error('Erro ao excluir produto:', err);
        showAlert('Erro ao excluir produto', 'error');
    });
}

document.getElementById('btnNovo').addEventListener('click', () => abrirModal());
document.getElementById('btnCancelar').addEventListener('click', fecharModal);

formProduto.addEventListener('submit', (e) => {
    e.preventDefault();

    const cod = document.getElementById('codProduto').value;
    const produto = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        categoria: document.getElementById('categoria').value,
        marca: document.getElementById('marca').value,
        preco: Number(document.getElementById('preco').value),
        percentualDesconto: Number(document.getElementById('percentualDesconto').value),
        quantidade: Number(document.getElementById('quantidade').value),
        imagem: document.getElementById('imagem').value
    };

    const url = cod
        ? `http://localhost:3000/produtos/atualizar/${cod}`
        : 'http://localhost:3000/produtos/cadastrar';

    let ok = false;

    fetch(url, {
        method: cod ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
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
        carregarProdutos();
    })
    .catch(err => {
        console.error('Erro ao salvar produto:', err);
        showAlert('Erro ao salvar produto', 'error');
    });
});

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
