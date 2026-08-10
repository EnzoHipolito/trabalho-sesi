const formProduto = document.getElementById('formProduto');
const idProduto = new URLSearchParams(window.location.search).get('id');

function preencherForm(produto) {
    document.getElementById('codProduto').value = produto.codProduto;
    document.getElementById('nome').value = produto.nome;
    document.getElementById('descricao').value = produto.descricao;
    document.getElementById('categoria').value = produto.categoria;
    document.getElementById('marca').value = produto.marca;
    document.getElementById('preco').value = produto.preco;
    document.getElementById('percentualDesconto').value = produto.percentualDesconto;
    document.getElementById('quantidade').value = produto.quantidade;
    document.getElementById('imagem').value = produto.imagem;
}

function carregarProduto() {
    if (!idProduto) {
        console.error('Nenhum produto selecionado');
        return;
    }

    fetch(`http://localhost:3000/produtos/consultarPorPk/${idProduto}`)
    .then(res => res.json())
    .then(dados => {
        if (!dados.getProduto) {
            console.error('Produto não encontrado');
            return;
        }
        preencherForm(dados.getProduto);
    })
    .catch(err => {
        console.error('Erro ao consultar produto:', err);
    });
}

formProduto.addEventListener('submit', (e) => {
    e.preventDefault();

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

    let ok = false;

    fetch(`http://localhost:3000/produtos/atualizar/${idProduto}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
    })
    .then(res => {
        ok = res.ok;
        return res.json();
    })
    .then(dados => {
        if (!ok) {
            console.error('Erro ao atualizar produto:', dados.message);
            return;
        }
        window.location.href = 'produtos.html';
    })
    .catch(err => {
        console.error('Erro ao atualizar produto:', err);
    });
});

carregarProduto();
