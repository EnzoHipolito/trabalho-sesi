const conn = require('./db/conn')

const criarViewsSistema = async () => {
    console.log('Iniciando a criação das Views customizadas no banco de dados...')

    // 1. View de Produtos Críticos (Ajustada para usar a coluna qtdeEstoque)
    const queryProdutosCriticos = `
        CREATE OR REPLACE VIEW vw_produtos_criticos AS
        SELECT
            codProduto AS codigo_produto,
            nome,
            categoria,
            quantidade AS quantidade_atual
        FROM produtos
        WHERE quantidade < 10;
    `

    // 2. View de Volume de Compras e Valores Financeiros Acumulados por Produto
    const queryVolumeCompras = `
        CREATE OR REPLACE VIEW vw_volume_compras AS
        SELECT
            p.nome AS nome,
            SUM(c.qtdeMov) AS quantidade_total_movimentada,
            SUM(c.precoFinal) AS valor_financeiro_movimentado
        FROM compras c
        INNER JOIN produtos p ON c.idProduto = p.codProduto
        WHERE c.tipo = 'SAIDA'
        GROUP BY p.codProduto, p.nome;
    `

    try {
        // Executa a criação da primeira view
        await conn.query(queryProdutosCriticos)
        console.log('» View [vw_produtos_criticos] criada ou atualizada com sucesso!')

        // Executa a criação da segunda view
        await conn.query(queryVolumeCompras)
        console.log('» View [vw_volume_compras] criada ou atualizada com sucesso!')

        console.log('Todas as Views foram geradas com sucesso no MySQL!')
    } catch (err) {
        console.error('Erro ao criar as Views no banco de dados:', err)
    } finally {
        // Fecha a conexão após a execução do script estrutural
        await conn.close()
        console.log('Conexão com o banco de dados fechada para o script criarviews.js.')
    }
}

// Executa a função estrutural
criarViewsSistema()
