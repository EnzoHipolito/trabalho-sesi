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
    
    const getProduto = await Produto.findByPk({where: {codProduto: codProduto}})
    
    try{
        
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
        const getProduto = await Produto.findByPk({where: {codProduto: codProduto}})
        
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

module.exports = { consultarPorPk, listar, cadastrar, apagar, atualizar }