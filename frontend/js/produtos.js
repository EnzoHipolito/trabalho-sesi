const tabelaProdutos = document.getElementById('tabelaProdutos');
const modalOverlay = document.getElementById('modalOverlay');
const formProduto = document.getElementById('formProduto');
const modalTitulo = document.getElementById('modalTitulo');

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

    tabelaProdutos.innerHTML = produtos.map(p => `
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
    `).join('');
}

let produtosCache = [];

async function carregarProdutos() {
    try {
        produtosCache = await Api.produtos.listar();
        renderTabela(produtosCache);
    } catch (err) {
        tabelaProdutos.innerHTML = `<tr class="empty-row"><td colspan="8">Erro: ${err.message}</td></tr>`;
    }
}

async function editarProduto(id) {
    try {
        const produto = await Api.produtos.consultarPorPk(id);
        abrirModal(produto);
    } catch (err) {
        showAlert('alertBox', err.message, 'error');
    }
}

async function excluirProduto(id) {
    if (!confirm('Deseja realmente excluir este produto?')) return;
    try {
        await Api.produtos.apagar(id);
        showAlert('alertBox', 'Produto excluído com sucesso!', 'success');
        carregarProdutos();
    } catch (err) {
        showAlert('alertBox', err.message, 'error');
    }
}

document.getElementById('btnNovo').addEventListener('click', () => abrirModal());
document.getElementById('btnCancelar').addEventListener('click', fecharModal);

formProduto.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cod = document.getElementById('codProduto').value;
    const dados = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        categoria: document.getElementById('categoria').value,
        marca: document.getElementById('marca').value,
        preco: Number(document.getElementById('preco').value),
        percentualDesconto: Number(document.getElementById('percentualDesconto').value),
        quantidade: Number(document.getElementById('quantidade').value),
        imagem: document.getElementById('imagem').value
    };

    try {
        if (cod) {
            await Api.produtos.atualizar(cod, dados);
            showAlert('alertBox', 'Produto atualizado com sucesso!', 'success');
        } else {
            await Api.produtos.cadastrar(dados);
            showAlert('alertBox', 'Produto cadastrado com sucesso!', 'success');
        }
        fecharModal();
        carregarProdutos();
    } catch (err) {
        showAlert('alertBox', err.message, 'error');
    }
});

document.getElementById('btnBuscar').addEventListener('click', async () => {
    const id = document.getElementById('buscaId').value.trim();
    if (!id) return;
    try {
        const produto = await Api.produtos.consultarPorPk(id);
        renderTabela(produto ? [produto] : []);
    } catch (err) {
        renderTabela([]);
    }
});

document.getElementById('btnLimparBusca').addEventListener('click', () => {
    document.getElementById('buscaId').value = '';
    renderTabela(produtosCache);
});

carregarProdutos();
