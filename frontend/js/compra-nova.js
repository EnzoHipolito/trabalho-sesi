const formCompra = document.getElementById('formCompra');
const selectUsuario = document.getElementById('idUsuario');
const selectProduto = document.getElementById('idProduto');

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

    fetch('http://localhost:3000/compras/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compra)
    })
    .then(res => {
        ok = res.ok;
        return res.json();
    })
    .then(dados => {
        if (!ok) {
            console.error('Erro ao cadastrar compra:', dados.message);
            return;
        }
        window.location.href = 'compras.html';
    })
    .catch(err => {
        console.error('Erro ao cadastrar compra:', err);
    });
});

carregarSelects();
