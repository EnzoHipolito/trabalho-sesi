const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3000
const db = require('./db/conn')
const CompraController = require('./controller/Compra.controller')
const ProdutoController = require('./controller/Produto.controller')
const UsuarioController = require('./controller/Usuario.controller')
const RelatVWController = require('./controller/relatVW.controller')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// Rotas de Compras
app.get('/compras/listar', CompraController.listar)
app.get('/compras/consultarPorPk/:codCompra', CompraController.consultarPorPk)
app.post('/compras/cadastrar', CompraController.cadastrar)
app.put('/compras/atualizar/:codCompra', CompraController.atualizar)

// Rotas de Produtos
app.get('/produtos/listar', ProdutoController.listar)
app.get('/produtos/consultarPorPk/:codProduto', ProdutoController.consultarPorPk)
app.post('/produtos/cadastrar', ProdutoController.cadastrar)
app.post('/produtos/cadastrarEmLote', ProdutoController.cadastrarEmLote)
app.put('/produtos/atualizar/:codProduto', ProdutoController.atualizar)
app.delete('/produtos/apagar/:codProduto', ProdutoController.apagar)

// Rotas de Usuarios
app.get('/usuarios/listar', UsuarioController.listar)
app.get('/usuarios/consultarPorPk/:codUsuario', UsuarioController.consultarPorPk)
app.get('/usuarios/consultarPorNome/:nome', UsuarioController.consultarPorNome)
app.post('/usuarios/cadastrar', UsuarioController.cadastrar)
app.post('/usuarios/cadastrarEmLote', UsuarioController.cadastrarEmLote)
app.put('/usuarios/atualizar/:codUsuario', UsuarioController.atualizar)
app.delete('/usuarios/apagar/:codUsuario', UsuarioController.apagar)

// Rotas de Relatórios Analíticos (Views SQL Nativas)
app.get('/relatorio/produtos-criticos', RelatVWController.listarHistoricoSaidas)
app.get('/relatorio/volume-compras', RelatVWController.listarPorCategorias)

db.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor iniciado na porta ${PORT}`)
        })
    })
    .catch((err) => {
        console.error('Erro ao iniciar servidor', err)
    })