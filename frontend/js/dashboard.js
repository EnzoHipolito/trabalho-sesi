async function carregarDashboard() {
    try {
        const [usuarios, produtos, compras] = await Promise.all([
            Api.usuarios.listar(),
            Api.produtos.listar(),
            Api.compras.listar()
        ]);

        document.getElementById('totalUsuarios').textContent = usuarios.length;
        document.getElementById('totalProdutos').textContent = produtos.length;
        document.getElementById('totalCompras').textContent = compras.length;

        const totalPago = compras
            .filter(c => c.statusCompra === 'PAGA')
            .reduce((soma, c) => soma + Number(c.precoFinal), 0);
        document.getElementById('totalPago').textContent = totalPago.toFixed(2);

        const usuariosMap = new Map(usuarios.map(u => [u.codUsuario, u]));
        const produtosMap = new Map(produtos.map(p => [p.codProduto, p]));

        const ultimas = [...compras]
            .sort((a, b) => b.codCompra - a.codCompra)
            .slice(0, 5);

        const tbody = document.getElementById('ultimasCompras');
        if (ultimas.length === 0) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="8">Nenhuma compra registrada</td></tr>';
            return;
        }

        tbody.innerHTML = ultimas.map(c => {
            const usuario = usuariosMap.get(c.idUsuario);
            const produto = produtosMap.get(c.idProduto);
            const statusClass = c.statusCompra === 'PAGA' ? 'badge-green' : 'badge-gray';
            return `
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
        }).join('');
    } catch (err) {
        document.getElementById('ultimasCompras').innerHTML =
            `<tr class="empty-row"><td colspan="8">Erro ao carregar: ${err.message}</td></tr>`;
    }
}

carregarDashboard();
