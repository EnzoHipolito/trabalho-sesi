const tabelaCompras = document.getElementById('tabelaCompras');
const modalOverlay = document.getElementById('modalOverlay');
const formCompra = document.getElementById('formCompra');
const modalTitulo = document.getElementById('modalTitulo');
const selectUsuario = document.getElementById('idUsuario');
const selectProduto = document.getElementById('idProduto');

let comprasCache = [];
let usuarios = [];
let produtos = [];

function showAlert(message, type = 'success') {
    const el = document.getElementById('alertBox');
    el.textContent = message;
    el.className = `alert show alert-${type}`;
    setTimeout(() => {
        el.className = 'alert';
    }, 4000);
}

function nomeUsuario(id) {
    const usuario = usuarios.find(u => u.codUsuario === id);
    return usuario ? `${usuario.nome} ${usuario.sobrenome}` : id;
}

function nomeProduto(id) {
    const produto = produtos.find(p => p.codProduto === id);
    return produto ? produto.nome : id;
}

function abrirModal(compra = null) {
    formCompra.reset();
    if (compra) {
        modalTitulo.textContent = 'Editar Compra';
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
    } else {
        modalTitulo.textContent = 'Nova Compra';
        document.getElementById('codCompra').value = '';
    }
    modalOverlay.classList.add('open');
}

function fecharModal() {
    modalOverlay.classList.remove('open');
}

function renderTabela(compras) {
    if (compras.length === 0) {
        tabelaCompras.innerHTML = '<tr class="empty-row"><td colspan="10">Nenhuma compra registrada</td></tr>';
        return;
    }

    let linhas = '';
    compras.forEach(c => {
        const statusClass = c.statusCompra === 'PAGA' ? 'badge-green' : 'badge-gray';
        linhas += `
            <tr>
                <td>${c.codCompra}</td>
                <td>${nomeUsuario(c.idUsuario)}</td>
                <td>${nomeProduto(c.idProduto)}</td>
                <td>${c.tipo}</td>
                <td>${c.qtdeMov}</td>
                <td>R$ ${Number(c.precoFinal).toFixed(2)}</td>
                <td>${c.formaPagamento}</td>
                <td><span class="badge ${statusClass}">${c.statusCompra}</span></td>
                <td>${c.data}</td>
                <td>
                    <button class="btn-primary btn-sm" onclick="editarCompra(${c.codCompra})">Editar</button>
                    <button class="btn-danger btn-sm" onclick="excluirCompra(${c.codCompra})">Excluir</button>
                </td>
            </tr>
        `;
    });
    tabelaCompras.innerHTML = linhas;
}

function carregarCompras() {
    fetch('http://localhost:3000/compras/listar')
    .then(res => res.json())
    .then(dados => {
        comprasCache = dados.getCompra;
        renderTabela(comprasCache);
    })
    .catch(err => {
        console.error('Erro ao listar compras:', err);
        tabelaCompras.innerHTML = '<tr class="empty-row"><td colspan="10">Erro ao carregar compras</td></tr>';
    });
}

function carregarSelects() {
    return fetch('http://localhost:3000/usuarios/listar')
    .then(res => res.json())
    .then(dados => {
        usuarios = dados.getUsuario;

        let options = '';
        usuarios.forEach(u => {
            options += `<option value="${u.codUsuario}">${u.codUsuario} - ${u.nome} ${u.sobrenome}</option>`;
        });
        selectUsuario.innerHTML = options;

        return fetch('http://localhost:3000/produtos/listar');
    })
    .then(res => res.json())
    .then(dados => {
        produtos = dados.getProduto;

        let options = '';
        produtos.forEach(p => {
            options += `<option value="${p.codProduto}">${p.codProduto} - ${p.nome}</option>`;
        });
        selectProduto.innerHTML = options;
    })
    .catch(err => {
        console.error('Erro ao carregar usuários e produtos:', err);
    });
}

function editarCompra(id) {
    fetch(`http://localhost:3000/compras/consultarPorPk/${id}`)
    .then(res => res.json())
    .then(dados => {
        if (!dados.getCompra) {
            showAlert('Compra não encontrada', 'error');
            return;
        }
        abrirModal(dados.getCompra);
    })
    .catch(err => {
        console.error('Erro ao consultar compra:', err);
        showAlert('Erro ao consultar compra', 'error');
    });
}

function excluirCompra(id) {
    if (!confirm('Deseja realmente excluir esta compra?')) return;

    let ok = false;

    fetch(`http://localhost:3000/compras/apagar/${id}`, { method: 'DELETE' })
    .then(res => {
        ok = res.ok;
        return res.json();
    })
    .then(dados => {
        if (!ok) {
            showAlert(dados.message, 'error');
            return;
        }
        showAlert(dados.message, 'success');
        carregarCompras();
    })
    .catch(err => {
        console.error('Erro ao excluir compra:', err);
        showAlert('Erro ao excluir compra', 'error');
    });
}

document.getElementById('btnNovo').addEventListener('click', () => abrirModal());
document.getElementById('btnCancelar').addEventListener('click', fecharModal);

formCompra.addEventListener('submit', (e) => {
    e.preventDefault();

    const cod = document.getElementById('codCompra').value;
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

    const url = cod
        ? `http://localhost:3000/compras/atualizar/${cod}`
        : 'http://localhost:3000/compras/cadastrar';

    let ok = false;

    fetch(url, {
        method: cod ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compra)
    })
    .then(res => {
        ok = res.ok;
        return res.json();
    })
    .then(dados => {
        if (!ok) {
            showAlert(dados.message, 'error');
            return;
        }
        showAlert(dados.message, 'success');
        fecharModal();
        carregarCompras();
    })
    .catch(err => {
        console.error('Erro ao salvar compra:', err);
        showAlert('Erro ao salvar compra', 'error');
    });
});

document.getElementById('btnBuscar').addEventListener('click', () => {
    const id = document.getElementById('buscaId').value.trim();
    if (!id) return;

    fetch(`http://localhost:3000/compras/consultarPorPk/${id}`)
    .then(res => res.json())
    .then(dados => {
        renderTabela(dados.getCompra ? [dados.getCompra] : []);
    })
    .catch(err => {
        console.error('Erro ao buscar compra:', err);
        renderTabela([]);
    });
});

document.getElementById('btnLimparBusca').addEventListener('click', () => {
    document.getElementById('buscaId').value = '';
    renderTabela(comprasCache);
});

carregarSelects().then(() => carregarCompras());
