const Produto = require('../models/Produto')

const cadastrar = async (req, res) => {
    const valores = req.body

    try{
        await Produto.create(valores)

        res.status(201).json({message: 'Produto cadastrado com sucesso!'})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao cadastrar produto!'})
        console.log(err)
    }
}

const cadastrarEmLote = async (req, res) => {
    try{
        const resposta = await fetch('https://dummyjson.com/products')

        if(!resposta.ok){
            return res.status(502).json({message: 'Erro ao consultar a API externa de produtos!'})
        }

        const dados = await resposta.json()

        const produtos = dados.products.map((produto) => ({
            nome: String(produto.title).substring(0, 40),
            descricao: String(produto.description).substring(0, 150),
            categoria: String(produto.category).substring(0, 40),
            preco: produto.price,
            percentualDesconto: produto.discountPercentage || 0,
            quantidade: produto.stock || 0,
            marca: String(produto.brand || 'Sem marca').substring(0, 40),
            imagem: String(produto.thumbnail || '').substring(0, 255)
        }))

        const cadastrados = await Produto.bulkCreate(produtos)

        res.status(201).json({message: `${cadastrados.length} produtos cadastrados em lote com sucesso!`, total: cadastrados.length})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao cadastrar produtos em lote!'})
        console.log(err)
    }
}

const apagar = async (req, res) => {
    const codProduto = req.params.codProduto
    
    try{
        const produto = await Produto.destroy({where: {codProduto: codProduto}})
        
        if(produto == 0){
            return res.status(500).json({message: 'Produto não encontrado'})
        }
        
        res.status(201).json({message: 'Produto deletado com sucesso!'})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao deletar produto!'})
        console.log(err)
    }
}

const atualizar = async (req, res) => {
    const valores = req.body
    const codProduto = req.params.codProduto

    try{
        const getProduto = await Produto.findByPk(codProduto)

        if(!getProduto){
            return res.status(404).json({message: 'Produto não encontrado'})
        }

        await Produto.update(valores, {where: {codProduto: codProduto}})
        
        res.status(201).json({message: 'Produto atualizado com sucesso!'})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao atualizar produto!'})
        console.log(err)
    }
}

const consultarPorPk = async (req, res) => {
    const codProduto = req.params.codProduto
    
    
    try{
        const getProduto = await Produto.findByPk(codProduto)

        if(!getProduto){
            return res.status(404).json({message: 'Produto não encontrado'})
        }

        res.status(201).json({getProduto})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao consultar produto!'})
        console.log(err)
    }
}

const listar = async (req, res) => {
    try{
        const getProduto = await Produto.findAll({raw: true})
        
        if(!getProduto){
            return res.status(404).json({message: 'Nenhum produto cadastrado!'})
        }
        
        res.status(201).json({getProduto})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao listar produtos!'})
        console.log(err)
    }
}

module.exports = { consultarPorPk, listar, cadastrar, cadastrarEmLote, apagar, atualizar }