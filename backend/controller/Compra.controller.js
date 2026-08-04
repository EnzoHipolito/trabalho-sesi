const Compra = require('../models/Compra')

const cadastrar = async (req, res) => {
    const valores = req.body

    try{
        await Compra.create(valores)

        res.status(201).json({message: 'Compra cadastrado com sucesso!'})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao cadastrar compra!'})
    }
}

const apagar = async (req, res) => {
    const codCompra = req.params.codCompra

    try{
        const compra = await Compra.destroy({where: {codCompra: codCompra}})
        
        if(compra == 0){
            return res.status(500).json({message: 'Compra não encontrado'})
        }

        res.status(201).json({message: 'Compra deletado com sucesso!'})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao deletar compra!'})
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

module.exports = { consultarPorPk, listar, cadastrar, apagar, atualizar }