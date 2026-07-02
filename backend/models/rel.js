const Usuario = require('./Usuario')
const Compra = require('./Compra')
const Produto = require('./Produto')

Usuario.hasMany(Compra, {
    foreignKey: 'idUsuario',
    as: 'compraUsuario',
    onDelete: 'CASCADE'
})

Compra.belongsTo(Usuario, {
    foreignKey: 'idProduto',
    as: 'usuarioCompra',
    allowNull: false
})

Produto.hasMany(Compra, {
    foreignKey: 'idProduto',
    as: 'compraProduto',
    onDelete: 'CASCADE'
})

Compra.belongsTo(Produto, {
    foreignKey: 'idProduto',
    as: 'produtoCompra',
    allowNull: false
})

module.exports = { Produto, Usuario, Compra }