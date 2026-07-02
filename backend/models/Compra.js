const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Compra = db.define('compra', {
    codCompra:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'codUsuario',
            model: 'usuarios'
        }
    },
    idProduto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: 'codProduto',
            model: 'produtos'
        }
    },
    tipo: {
        type: DataTypes.ENUM('ENTRADA', 'SAIDA'),
        allowNull: false
    },
    qtdeMov: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precoUnit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    desconto: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    precoFinal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    formaPagamento: {
        type: DataTypes.ENUM('DEBITO', 'CREDITO', 'DINHEIRO'),
        allowNull: false
    },
    statusCompra: {
        type: DataTypes.ENUM('PAGA', 'PENDENTE'),
        allowNull: false
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
},{
    timestamps: false,
    tableName: 'compras'
})

module.exports = Compra;