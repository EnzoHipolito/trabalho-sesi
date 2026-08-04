const tabelaCompras = document.getElementById('tabelaCompras');
const modalOverlay = document.getElementById('modalOverlay');
const formCompra = document.getElementById('formCompra');
const modalTitulo = document.getElementById('modalTitulo');
const selectUsuario = document.getElementById('idUsuario');
const selectProduto = document.getElementById('idProduto');

let comprasCache = [];
let usuariosMap = new Map();
let produtosMap = new Map();

async function carregarSelects() {
    const [usuarios, produtos] = await Promise.all([
        Api.usuarios.listar(),
        Api.produtos.listar()
    ]);

    usuariosMap = new Map(usuarios.map(u => [u.codUsuario, u]));
    produtosMap = new Map(produtos.map(p => [p.codProduto, p]));

    selectUsuario.innerHTML = usuarios
        .map(u => `<option value="${u.codUsuario}">${u.codUsuario} - ${u.nome} ${u.sobrenome}</option>`)
        .join('');

    selectProduto.innerHTML = produtos
        .map(p => `<option value="${p.codProduto}">${p.codProduto} - ${p.nome}</option>`)
        .join('');
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

    tabelaCompras.innerHTML = compras.map(c => {
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
                <td>${c.formaPagamento}</td>
                <td><span class="badge ${statusClass}">${c.statusCompra}</span></td>
                <td>${c.data}</td>
                <td>
                    <button class="btn-primary btn-sm" onclick="editarCompra(${c.codCompra})">Editar</button>
                    <button class="btn-danger btn-sm" onclick="excluirCompra(${c.codCompra})">Excluir</button>
                </td>
            </tr>
        `;
    }).join('');
}

async function carregarCompras() {
    try {
        comprasCache = await Api.compras.listar();
        renderTabela(comprasCache);
    } catch (err) {
        tabelaCompras.innerHTML = `<tr class="empty-row"><td colspan="10">Erro: ${err.message}</td></tr>`;
    }
}

async function editarCompra(id) {
    try {
        const compra = await Api.compras.consultarPorPk(id);
        abrirModal(compra);
    } catch (err) {
        showAlert('alertBox', err.message, 'error');
    }
}

async function excluirCompra(id) {
    if (!confirm('Deseja realmente excluir esta compra?')) return;
    try {
        await Api.compras.apagar(id);
        showAlert('alertBox', 'Compra excluída com sucesso!', 'success');
        carregarCompras();
    } catch (err) {
        showAlert('alertBox', err.message, 'error');
    }
}

document.getElementById('btnNovo').addEventListener('click', () => abrirModal());
document.getElementById('btnCancelar').addEventListener('click', fecharModal);

formCompra.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cod = document.getElementById('codCompra').value;
    const dados = {
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

    try {
        if (cod) {
            await Api.compras.atualizar(cod, dados);
            showAlert('alertBox', 'Compra atualizada com sucesso!', 'success');
        } else {
            await Api.compras.cadastrar(dados);
            showAlert('alertBox', 'Compra cadastrada com sucesso!', 'success');
        }
        fecharModal();
        carregarCompras();
    } catch (err) {
        showAlert('alertBox', err.message, 'error');
    }
});

document.getElementById('btnBuscar').addEventListener('click', async () => {
    const id = document.getElementById('buscaId').value.trim();
    if (!id) return;
    try {
        const compra = await Api.compras.consultarPorPk(id);
        renderTabela(compra ? [compra] : []);
    } catch (err) {
        renderTabela([]);
    }
});

document.getElementById('btnLimparBusca').addEventListener('click', () => {
    document.getElementById('buscaId').value = '';
    renderTabela(comprasCache);
});

(async function init() {
    await carregarSelects();
    await carregarCompras();
})();
