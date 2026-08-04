const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const VwProdutosCriticos = db.define('VwProdutosCriticos', {
    codigo_produto: {
        type: DataTypes.INTEGER,
        primaryKey: true // O Sequelize exige uma chave primária para o mapeamento
    },
    nome: {
        type: DataTypes.STRING(100)
    },
    categoria: {
        type: DataTypes.STRING(50)
    },
    quantidade_atual: {
        type: DataTypes.INTEGER
    }
}, {
    timestamps: false,
    tableName: 'vw_produtos_criticos'
})

module.exports = VwProdutosCriticos