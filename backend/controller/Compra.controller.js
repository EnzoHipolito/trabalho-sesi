const Compra = require('../models/Compra')
const Produto = require('../models/Produto')

const cadastrar = async (req, res) => {
    const valores = req.body
    const produto = Produto.findByPk(valores.idProduto)

    try{
        if(!produto){
            return res.status(404).json({message: 'Produto não encontrado'})
        }

        if(valores.tipo == 'SAIDA' && produto.estoque < valores.qtdeMov){
            return res.status(403).json({message: 'Sem estoque suficiente!'})
        }

        await Compra.create(valores)

        res.status(201).json({message: 'Compra cadastrado com sucesso!'})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao cadastrar compra!'})
    }
}

const atualizar = async (req, res) => {
    const valores = req.body
    const codCompra = req.params.codCompra

    try{
        const getCompra = await Compra.findByPk(codCompra)

        if(!getCompra){
            return res.status(404).json({message: 'Compra não encontrado'})
        }

        await Compra.update(valores, {where: {codCompra: codCompra}})

        res.status(201).json({message: 'Compra atualizado com sucesso!'})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao atualizar compra!'})
    }
}

const consultarPorPk = async (req, res) => {
    const codCompra = req.params.codCompra

    
    try{
        const getCompra = await Compra.findByPk(codCompra)

        if(!getCompra){
            return res.status(404).json({message: 'Compra não encontrado'})
        }

        res.status(201).json({getCompra})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao consultar compra!'})
    }
}

const listar = async (req, res) => {
    try{
        const getCompra = await Compra.findAll({raw: true})

        if(!getCompra){
            return res.status(404).json({message: 'Nenhum compra cadastrado!'})
        }

        res.status(201).json({getCompra})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao listar compras!'})
    }
}

module.exports = { consultarPorPk, listar, cadastrar, atualizar }