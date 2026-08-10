const tabelaVolume = document.getElementById('tabelaVolume');
const rodapeVolume = document.getElementById('rodapeVolume');
const tabelaCriticos = document.getElementById('tabelaCriticos');
const resumo = document.getElementById('resumo');

function renderVolume(dados) {
    if (dados.length === 0) {
        tabelaVolume.innerHTML = '<tr class="empty-row"><td colspan="4">Nenhuma saída registrada</td></tr>';
        rodapeVolume.innerHTML = '';
        return 0;
    }

    dados.sort((a, b) => {
        return Number(b.valor_financeiro_movimentado || 0) - Number(a.valor_financeiro_movimentado || 0);
    });

    let totalQtde = 0;
    let totalValor = 0;
    dados.forEach(d => {
        totalQtde += Number(d.quantidade_total_movimentada || 0);
        totalValor += Number(d.valor_financeiro_movimentado || 0);
    });

    let linhas = '';
    dados.forEach(d => {
        const valor = Number(d.valor_financeiro_movimentado || 0);
        const percentual = totalValor > 0 ? (valor / totalValor) * 100 : 0;
        linhas += `
            <tr>
                <td>${d.nome}</td>
                <td>${d.quantidade_total_movimentada}</td>
                <td>R$ ${valor.toFixed(2)}</td>
                <td>${percentual.toFixed(1)}%</td>
            </tr>
        `;
    });
    tabelaVolume.innerHTML = linhas;

    rodapeVolume.innerHTML = `
        <tr>
            <td>Total (${dados.length} produtos)</td>
            <td>${totalQtde}</td>
            <td>R$ ${totalValor.toFixed(2)}</td>
            <td>100,0%</td>
        </tr>
    `;

    return totalValor;
}

function renderCriticos(dados) {
    if (dados.length === 0) {
        tabelaCriticos.innerHTML = '<tr class="empty-row"><td colspan="4">Nenhum produto com estoque crítico</td></tr>';
        return 0;
    }

    dados.sort((a, b) => {
        return Number(a.quantidade_atual || 0) - Number(b.quantidade_atual || 0);
    });

    let linhas = '';
    dados.forEach(d => {
        linhas += `
            <tr>
                <td>${d.codigo_produto}</td>
                <td>${d.nome}</td>
                <td>${d.categoria}</td>
                <td>${d.quantidade_atual}</td>
            </tr>
        `;
    });
    tabelaCriticos.innerHTML = linhas;

    return dados.length;
}

function carregarRelatorios() {
    resumo.textContent = 'Carregando dados...';

    let totalMovimentado = 0;

    fetch('http://localhost:3000/relatorio/volume-compras')
    .then(res => res.json())
    .then(dados => {
        totalMovimentado = renderVolume(dados);
        return fetch('http://localhost:3000/relatorio/produtos-criticos');
    })
    .then(res => res.json())
    .then(dados => {
        const qtdeCriticos = renderCriticos(dados);
        resumo.textContent = `Total movimentado: R$ ${totalMovimentado.toFixed(2)} | Produtos críticos: ${qtdeCriticos}`;
    })
    .catch(err => {
        console.error('Erro ao carregar relatórios:', err);
        tabelaVolume.innerHTML = '<tr class="empty-row"><td colspan="4">Erro ao carregar dados</td></tr>';
        tabelaCriticos.innerHTML = '<tr class="empty-row"><td colspan="5">Erro ao carregar dados</td></tr>';
        rodapeVolume.innerHTML = '';
        resumo.textContent = 'Erro ao carregar relatórios';
    });
}

document.getElementById('btnAtualizar').addEventListener('click', carregarRelatorios);

carregarRelatorios();
