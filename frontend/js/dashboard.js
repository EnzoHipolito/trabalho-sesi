let usuarios = [];
let produtos = [];

function renderUltimasCompras(compras) {
    const tbody = document.getElementById('ultimasCompras');

    const ultimas = [...compras]
        .sort((a, b) => b.codCompra - a.codCompra)
        .slice(0, 5);

    if (ultimas.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="8">Nenhuma compra registrada</td></tr>';
        return;
    }

    let linhas = '';
    ultimas.forEach(c => {
        const usuario = usuarios.find(u => u.codUsuario === c.idUsuario);
        const produto = produtos.find(p => p.codProduto === c.idProduto);
        const statusClass = c.statusCompra === 'PAGA' ? 'badge-green' : 'badge-gray';
        linhas += `
            <tr>
                <td>${c.codCompra}</td>
                <td>${usuario ? usuario.nome + ' ' + usuario.sobrenome : c.idUsuario}</td>
                <td>${produto ? produto.nome : c.idProduto}</td>
                <td>${c.tipo}</td>
                <td>${c.qtdeMov}</td>
                <td>R$ ${Number(c.precoFinal).toFixed(2)}</td>
                <td><span class="badge ${statusClass}">${c.statusCompra}</span></td>
                <td>${c.data}</td>
            </tr>
        `;
    });
    tbody.innerHTML = linhas;
}

function carregarDashboard() {
    fetch('http://localhost:3000/usuarios/listar')
    .then(res => res.json())
    .then(dados => {
        usuarios = dados.getUsuario;
        document.getElementById('totalUsuarios').textContent = usuarios.length;

        return fetch('http://localhost:3000/produtos/listar');
    })
    .then(res => res.json())
    .then(dados => {
        produtos = dados.getProduto;
        document.getElementById('totalProdutos').textContent = produtos.length;

        return fetch('http://localhost:3000/compras/listar');
    })
    .then(res => res.json())
    .then(dados => {
        const compras = dados.getCompra;
        document.getElementById('totalCompras').textContent = compras.length;

        let totalPago = 0;
        compras.forEach(c => {
            if (c.statusCompra === 'PAGA') {
                totalPago += Number(c.precoFinal);
            }
        });
        document.getElementById('totalPago').textContent = totalPago.toFixed(2);

        renderUltimasCompras(compras);
    })
    .catch(err => {
        console.error('Erro ao carregar dashboard:', err);
        document.getElementById('ultimasCompras').innerHTML =
            '<tr class="empty-row"><td colspan="8">Erro ao carregar dados</td></tr>';
    });
}

carregarDashboard();
