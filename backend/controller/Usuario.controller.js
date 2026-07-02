const Usuario = require('../models/Usuario')

const cadastrar = async (req, res) => {
    const valores = req.body

    try{
        await Usuario.create(valores)

        res.status(201).json({message: 'Usuario cadastrado com sucesso!'})
    }
    catch(err){
        console.error('Erro ao cadastrar:', err)
        res.status(500).json({message: 'Erro ao cadastrar usuario!'})
    }
}

const apagar = async (req, res) => {
    const codUsuario = req.params.codUsuario

    try{
        const usuario = await Usuario.destroy({where: {codUsuario: codUsuario}})
        
        if(usuario == 0){
            return res.status(500).json({message: 'Usuario não encontrado'})
        }

        res.status(200).json({message: 'Usuario deletado com sucesso!'})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao deletar usuario!'})
    }
}

const atualizar = async (req, res) => {
    const valores = req.body
    const codUsuario = req.params.codUsuario

    const getUsuario = await Usuario.findByPk({where: {codUsuario: codUsuario}})

    try{

        if(!getUsuario){
            return res.status(404).json({message: 'Usuario não encontrado'})
        }

        await Usuario.update(valores, {where: {codUsuario: codUsuario}})

        res.status(200).json({message: 'Usuario atualizado com sucesso!'})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao atualizar usuario!'})
    }
}

const consultarPorPk = async (req, res) => {
    const codUsuario = req.params.codUsuario

    
    try{
        const getUsuario = await Usuario.findByPk({where: {codUsuario: codUsuario}})

        if(!getUsuario){
            return res.status(404).json({message: 'Usuario não encontrado'})
        }

        res.status(200).json({getUsuario})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao consultar usuario!'})
    }
}

const consultarPorNome = async (req, res) => {
    const nome = req.params.nome

    
    try{
        const getUsuario = await Usuario.findOne({where: {nome: nome}})

        if(!getUsuario){
            return res.status(404).json({message: 'Usuario não encontrado'})
        }

        res.status(200).json({getUsuario})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao consultar usuario!'})
    }
}

const listar = async (req, res) => {
    try{
        const getUsuario = await Usuario.findAll({raw: true})

        if(!getUsuario){
            return res.status(404).json({message: 'Nenhum usuario cadastrado!'})
        }

        res.status(200).json({getUsuario})
    }
    catch(err){
        res.status(500).json({message: 'Erro ao listar usuarios!'})
    }
}

module.exports = { consultarPorPk, listar, cadastrar, apagar, atualizar }