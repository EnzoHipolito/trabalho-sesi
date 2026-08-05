const catalogGrid = document.getElementById('catalogGrid');
const filtroCategoria = document.getElementById('filtroCategoria');
let produtosCatalogo = [];

function renderCatalogo(produtos) {
    if (produtos.length === 0) {
        catalogGrid.innerHTML = '<p>Nenhum produto encontrado</p>';
        return;
    }

    let cards = '';
    produtos.forEach(p => {
        const precoOriginal = Number(p.preco);
        const precoFinal = precoOriginal * (1 - Number(p.percentualDesconto) / 100);
        const temDesconto = Number(p.percentualDesconto) > 0;
        const estoqueBadge = p.quantidade > 0
            ? `<span class="badge badge-green">${p.quantidade} em estoque</span>`
            : `<span class="badge badge-red">Sem estoque</span>`;

        cards += `
            <div class="product-card">
                <img src="${p.imagem}" alt="${p.nome}">
                <div class="info">
                    <span class="marca">${p.marca}</span>
                    <span class="nome">${p.nome}</span>
                    ${temDesconto ? `<span class="preco-original">R$ ${precoOriginal.toFixed(2)}</span>` : ''}
                    <span class="preco-final">R$ ${precoFinal.toFixed(2)}</span>
                    ${estoqueBadge}
                </div>
            </div>
        `;
    });
    catalogGrid.innerHTML = cards;
}

function aplicarFiltro() {
    const categoria = filtroCategoria.value;
    const filtrados = categoria
        ? produtosCatalogo.filter(p => p.categoria === categoria)
        : produtosCatalogo;
    renderCatalogo(filtrados);
}

function carregarCatalogo() {
    fetch('http://localhost:3000/produtos/listar')
    .then(res => res.json())
    .then(dados => {
        produtosCatalogo = dados.getProduto;

        let options = '<option value="">Todas as categorias</option>';
        const categorias = [];
        produtosCatalogo.forEach(p => {
            if (!categorias.includes(p.categoria)) {
                categorias.push(p.categoria);
                options += `<option value="${p.categoria}">${p.categoria}</option>`;
            }
        });
        filtroCategoria.innerHTML = options;

        renderCatalogo(produtosCatalogo);
    })
    .catch(err => {
        console.error('Erro ao carregar catálogo:', err);
        catalogGrid.innerHTML = '<p>Erro ao carregar catálogo</p>';
    });
}

filtroCategoria.addEventListener('change', aplicarFiltro);

carregarCatalogo();
