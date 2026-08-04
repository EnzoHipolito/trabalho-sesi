const catalogGrid = document.getElementById('catalogGrid');
const filtroCategoria = document.getElementById('filtroCategoria');
let produtosCatalogo = [];

function renderCatalogo(produtos) {
    if (produtos.length === 0) {
        catalogGrid.innerHTML = '<p>Nenhum produto encontrado</p>';
        return;
    }

    catalogGrid.innerHTML = produtos.map(p => {
        const precoOriginal = Number(p.preco);
        const precoFinal = precoOriginal * (1 - Number(p.percentualDesconto) / 100);
        const temDesconto = Number(p.percentualDesconto) > 0;
        const estoqueBadge = p.quantidade > 0
            ? `<span class="badge badge-green">${p.quantidade} em estoque</span>`
            : `<span class="badge badge-red">Sem estoque</span>`;

        return `
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
    }).join('');
}

function aplicarFiltro() {
    const categoria = filtroCategoria.value;
    const filtrados = categoria
        ? produtosCatalogo.filter(p => p.categoria === categoria)
        : produtosCatalogo;
    renderCatalogo(filtrados);
}

async function carregarCatalogo() {
    try {
        produtosCatalogo = await Api.produtos.listar();

        const categorias = [...new Set(produtosCatalogo.map(p => p.categoria))];
        filtroCategoria.innerHTML = '<option value="">Todas as categorias</option>' +
            categorias.map(c => `<option value="${c}">${c}</option>`).join('');

        renderCatalogo(produtosCatalogo);
    } catch (err) {
        catalogGrid.innerHTML = `<p>Erro ao carregar catálogo: ${err.message}</p>`;
    }
}

filtroCategoria.addEventListener('change', aplicarFiltro);

carregarCatalogo();
