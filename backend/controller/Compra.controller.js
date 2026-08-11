const db = require('../db/conn')
const Compra = require('../models/Compra')
const Produto = require('../models/Produto')

const cadastrar = async (req, res) => {
    const valores = req.body

    const transaction = await db.transaction()

    try{
        if(valores.tipo != 'ENTRADA' && valores.tipo != 'SAIDA'){
            await transaction.rollback()
            return res.status(400).json({message: 'Tipo de movimentação inválido! Use ENTRADA ou SAIDA.'})
        }

        const qtdeMov = Number(valores.qtdeMov)

        if(!Number.isInteger(qtdeMov) || qtdeMov <= 0){
            await transaction.rollback()
            return res.status(400).json({message: 'A quantidade movimentada deve ser um número inteiro maior que zero!'})
        }

        const produto = await Produto.findByPk(valores.idProduto, {
            transaction: transaction,
            lock: transaction.LOCK.UPDATE
        })

        if(!produto){
            await transaction.rollback()
            return res.status(404).json({message: 'Produto não encontrado'})
        }

        if(valores.tipo == 'SAIDA' && produto.quantidade < qtdeMov){
            await transaction.rollback()
            return res.status(403).json({message: `Sem estoque suficiente! O produto "${produto.nome}" tem apenas ${produto.quantidade} unidade(s).`})
        }

        if(valores.tipo == 'ENTRADA'){
            produto.quantidade = produto.quantidade + qtdeMov
        }
        else{
            produto.quantidade = produto.quantidade - qtdeMov
        }

        await produto.save({transaction: transaction})

        await Compra.create(valores, {transaction: transaction})

        await transaction.commit()

        res.status(201).json({message: 'Compra cadastrado com sucesso!'})
    }
    catch(err){
        await transaction.rollback()
        res.status(500).json({message: 'Erro ao cadastrar compra!'})
        console.log(err)
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
