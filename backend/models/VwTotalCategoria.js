const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const VwTotalCategoria = db.define('VwTotalCategoria', {
    nome: {
        type: DataTypes.STRING(100),
        primaryKey: true // O Sequelize exige uma chave primária para o mapeamento do findAll
    },
    quantidade_total_movimentada: {
        type: DataTypes.INTEGER
    },
    valor_financeiro_movimentado: {
        type: DataTypes.DECIMAL(10, 2)
    }
}, {
    timestamps: false,
    tableName: 'vw_volume_compras'
})

module.exports = VwTotalCategoria
