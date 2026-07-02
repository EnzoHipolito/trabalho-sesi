const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Produto = db.define('produto', {
    codProduto:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    categoria: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    percentualDesconto: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    marca: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    imagem: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
},{
    timestamps: false,
    tableName: 'produtos'
})

module.exports = Produto;