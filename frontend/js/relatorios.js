let resposta_volume = document.getElementById('resposta_volume')
let gerar_grafico_volume = document.getElementById('gerar_grafico_volume')
let meuGrafico_volume = null

gerar_grafico_volume.addEventListener('click', () => {
    fetch('http://localhost:3000/relatorio/volume-compras')
    .then(res => res.json())
    .then(dados => {
        console.log("=========================================")
        console.log("DADOS DO RELATÓRIO DE CATEGORIAS RECEBIDOS:")
        console.log(dados)
        console.log("=========================================")

        if (dados.length === 0) {
            resposta_volume.innerHTML = 'Nenhum dado de compras encontrado para processar o gráfico.'
            return
        }

        resposta_volume.innerHTML = 'Sucesso! Gráfico gerado com os dados consolidados.'

        dados.sort((a, b) => {
            let valorA = parseFloat(a.valor_financeiro_movimentado || 0)
            let valorB = parseFloat(b.valor_financeiro_movimentado || 0)
            return valorB - valorA
        })

        let produtos = []
        let valores = []

        let limite = dados.length > 5 ? 5 : dados.length
        for (let i = 0; i < limite; i++) {
            produtos.push(dados[i].nome || `Item ${i+1}`)
            valores.push(parseFloat(dados[i].valor_financeiro_movimentado || 0))
        }

        if (meuGrafico_volume !== null) {
            meuGrafico_volume.destroy()
        }

        let ctx = document.getElementById('graf_volume').getContext('2d')

        Chart.defaults.backgroundColor = '#0f4c81'
        Chart.defaults.borderColor = 'white'
        Chart.defaults.color = '#fff'
        Chart.defaults.font.size = 16
        Chart.defaults.font.family = 'sans-serif'
        Chart.defaults.font.weight = 'bold'

        const data = {
            labels: produtos,
            datasets: [{
                label: 'Volume Financeiro (R$)',
                data: valores,
                fill: true,
                borderColor: 'white',
                borderWidth: 4,
                tension: 0.3
            }]
        }

        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: true },
                    title: {
                        display: true,
                        text: 'Top 5 - Volume Financeiro de Compras por Mercadoria'
                    },
                    datalabels: {
                        display: true,
                        align: 'right',
                        color: 'white',
                        font: { weight: 'bold' }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: { display: true, text: 'Valor Financeiro Movimentado (R$)' }
                    },
                    y: {
                        display: true,
                        title: { display: true, text: 'Produto / Categoria' }
                    }
                }
            },
            plugins: [ChartDataLabels]
        }

        meuGrafico_volume = new Chart(ctx, config)
    })
    .catch(err => {
        console.error('Erro ao buscar dados do relatório gráfico:', err)
        resposta_volume.innerHTML = 'Erro ao carregar dados do endpoint do banco.'
    })
})

let resposta_criticos = document.getElementById('resposta_criticos')
let gerar_grafico_criticos = document.getElementById('gerar_grafico_criticos')
let meuGrafico_criticos = null

gerar_grafico_criticos.addEventListener('click', () => {
    fetch('http://localhost:3000/relatorio/produtos-criticos')
    .then(res => res.json())
    .then(dados => {
        console.log("=========================================")
        console.log("DADOS DO RELATÓRIO DE PRODUTOS CRÍTICOS:")
        console.log(dados)
        console.log("=========================================")

        let dadosFiltrados = []
        for (let i = 0; i < dados.length; i++) {
            let estoque = parseInt(dados[i].quantidade_atual || 0)
            if (estoque < 10) {
                dadosFiltrados.push(dados[i])
            }
        }

        if (dadosFiltrados.length === 0) {
            resposta_criticos.innerHTML = 'Nenhum produto crítico (estoque < 10) detectado para gerar o gráfico!'
            if (meuGrafico_criticos !== null) meuGrafico_criticos.destroy()
            return
        }

        resposta_criticos.innerHTML = `Alerta! Exibindo ${dadosFiltrados.length} itens com estoque crítico (< 10).`

        let produtos = []
        let estoques = []

        for (let i = 0; i < dadosFiltrados.length; i++) {
            produtos.push(dadosFiltrados[i].nome || "Produto Sem Nome")
            estoques.push(parseInt(dadosFiltrados[i].quantidade_atual || 0))
        }

        if (meuGrafico_criticos !== null) {
            meuGrafico_criticos.destroy()
        }

        let ctx = document.getElementById('graf_criticos').getContext('2d')

        Chart.defaults.backgroundColor = '#0f4c81'
        Chart.defaults.borderColor = 'white'
        Chart.defaults.color = '#fff'
        Chart.defaults.font.size = 16
        Chart.defaults.font.family = 'sans-serif'
        Chart.defaults.font.weight = 'bold'

        const data = {
            labels: produtos,
            datasets: [{
                label: 'Quantidade em Estoque',
                data: estoques,
                fill: true,
                borderColor: 'white',
                borderWidth: 4,
                tension: 0.3
            }]
        }

        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true },
                    title: {
                        display: true,
                        text: 'Estoque Físico Crítico Atual (< 10 unidades)'
                    },
                    datalabels: {
                        display: true,
                        align: 'top',
                        color: 'white',
                        font: { weight: 'bold' }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: { display: true, text: 'Produto' }
                    },
                    y: {
                        display: true,
                        title: { display: true, text: 'Quantidade em Depósito' },
                        suggestedMax: 10
                    }
                }
            },
            plugins: [ChartDataLabels]
        }

        meuGrafico_criticos = new Chart(ctx, config)
    })
    .catch(err => {
        console.error('Erro ao buscar dados de criticidade:', err)
        resposta_criticos.innerHTML = 'Erro ao carregar dados do endpoint de criticidade.'
    })
})
