const formProduto = document.getElementById('formProduto');
const btnLote = document.getElementById('btnLote');
const bulkStatus = document.getElementById('bulkStatus');

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

btnLote.addEventListener('click', () => {
    btnLote.disabled = true;
    bulkStatus.className = 'bulk-status';
    bulkStatus.textContent = 'Buscando dados na API externa...';

    let ok = false;

    fetch('http://localhost:3000/produtos/cadastrarEmLote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
        ok = res.ok;
        return res.json();
    })
    .then(dados => {
        if (!ok) {
            bulkStatus.className = 'bulk-status erro';
            bulkStatus.textContent = dados.message;
            btnLote.disabled = false;
            return;
        }
        bulkStatus.className = 'bulk-status ok';
        bulkStatus.textContent = dados.message;
        setTimeout(() => { window.location.href = 'produtos.html'; }, 1200);
    })
    .catch(err => {
        console.error('Erro ao cadastrar produtos em lote:', err);
        bulkStatus.className = 'bulk-status erro';
        bulkStatus.textContent = 'Erro ao cadastrar produtos em lote!';
        btnLote.disabled = false;
    });
});
