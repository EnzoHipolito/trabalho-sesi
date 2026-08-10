const formCompra = document.getElementById('formCompra');
const selectUsuario = document.getElementById('idUsuario');
const selectProduto = document.getElementById('idProduto');
const idCompra = new URLSearchParams(window.location.search).get('id');

function carregarSelects() {
    return fetch('http://localhost:3000/usuarios/listar')
    .then(res => res.json())
    .then(dados => {
        let options = '';
        dados.getUsuario.forEach(u => {
            options += `<option value="${u.codUsuario}">${u.codUsuario} - ${u.nome} ${u.sobrenome}</option>`;
        });
        selectUsuario.innerHTML = options;

        return fetch('http://localhost:3000/produtos/listar');
    })
    .then(res => res.json())
    .then(dados => {
        let options = '';
        dados.getProduto.forEach(p => {
            options += `<option value="${p.codProduto}">${p.codProduto} - ${p.nome}</option>`;
        });
        selectProduto.innerHTML = options;
    })
    .catch(err => {
        console.error('Erro ao carregar usuários e produtos:', err);
    });
}

function preencherForm(compra) {
    document.getElementById('codCompra').value = compra.codCompra;
    selectUsuario.value = compra.idUsuario;
    selectProduto.value = compra.idProduto;
    document.getElementById('tipo').value = compra.tipo;
    document.getElementById('qtdeMov').value = compra.qtdeMov;
    document.getElementById('precoUnit').value = compra.precoUnit;
    document.getElementById('desconto').value = compra.desconto;
    document.getElementById('precoFinal').value = compra.precoFinal;
    document.getElementById('formaPagamento').value = compra.formaPagamento;
    document.getElementById('statusCompra').value = compra.statusCompra;
    document.getElementById('data').value = compra.data;
}

function carregarCompra() {
    if (!idCompra) {
        console.error('Nenhuma compra selecionada');
        return;
    }

    fetch(`http://localhost:3000/compras/consultarPorPk/${idCompra}`)
    .then(res => res.json())
    .then(dados => {
        if (!dados.getCompra) {
            console.error('Compra não encontrada');
            return;
        }
        preencherForm(dados.getCompra);
    })
    .catch(err => {
        console.error('Erro ao consultar compra:', err);
    });
}

formCompra.addEventListener('submit', (e) => {
    e.preventDefault();

    const compra = {
        idUsuario: Number(selectUsuario.value),
        idProduto: Number(selectProduto.value),
        tipo: document.getElementById('tipo').value,
        qtdeMov: Number(document.getElementById('qtdeMov').value),
        precoUnit: Number(document.getElementById('precoUnit').value),
        desconto: Number(document.getElementById('desconto').value),
        precoFinal: Number(document.getElementById('precoFinal').value),
        formaPagamento: document.getElementById('formaPagamento').value,
        statusCompra: document.getElementById('statusCompra').value,
        data: document.getElementById('data').value
    };

    let ok = false;

    fetch(`http://localhost:3000/compras/atualizar/${idCompra}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compra)
    })
    .then(res => {
        ok = res.ok;
        return res.json();
    })
    .then(dados => {
        if (!ok) {
            console.error('Erro ao atualizar compra:', dados.message);
            return;
        }
        window.location.href = 'compras.html';
    })
    .catch(err => {
        console.error('Erro ao atualizar compra:', err);
    });
});

carregarSelects().then(() => carregarCompra());
