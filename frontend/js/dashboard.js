let usuarios = [];
let produtos = [];

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
    })
    .catch(err => {
        console.error('Erro ao carregar dashboard:', err);
    });
}

carregarDashboard();
