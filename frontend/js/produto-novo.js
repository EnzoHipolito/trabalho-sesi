const formProduto = document.getElementById('formProduto');

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

    fetch('http://localhost:3000/produtos/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
    })
    .then(res => {
        ok = res.ok;
        return res.json();
    })
    .then(dados => {
        if (!ok) {
            console.error('Erro ao cadastrar produto:', dados.message);
            return;
        }
        window.location.href = 'produtos.html';
    })
    .catch(err => {
        console.error('Erro ao cadastrar produto:', err);
    });
});
