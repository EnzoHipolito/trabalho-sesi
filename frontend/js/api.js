const API_BASE = 'http://localhost:3000';

async function apiRequest(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });

    let body = null;
    try {
        body = await res.json();
    } catch (e) {
        body = null;
    }

    if (!res.ok) {
        const message = (body && body.message) || `Erro na requisição (${res.status})`;
        throw new Error(message);
    }

    return body;
}

const Api = {
    usuarios: {
        listar: () => apiRequest('/usuarios/listar').then(r => r.getUsuario || []),
        consultarPorPk: (id) => apiRequest(`/usuarios/consultarPorPk/${id}`).then(r => r.getUsuario),
        consultarPorNome: (nome) => apiRequest(`/usuarios/consultarPorNome/${nome}`).then(r => r.getUsuario),
        cadastrar: (dados) => apiRequest('/usuarios/cadastrar', { method: 'POST', body: JSON.stringify(dados) }),
        atualizar: (id, dados) => apiRequest(`/usuarios/atualizar/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
        apagar: (id) => apiRequest(`/usuarios/apagar/${id}`, { method: 'DELETE' })
    },
    produtos: {
        listar: () => apiRequest('/produtos/listar').then(r => r.getProduto || []),
        consultarPorPk: (id) => apiRequest(`/produtos/consultarPorPk/${id}`).then(r => r.getProduto),
        cadastrar: (dados) => apiRequest('/produtos/cadastrar', { method: 'POST', body: JSON.stringify(dados) }),
        atualizar: (id, dados) => apiRequest(`/produtos/atualizar/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
        apagar: (id) => apiRequest(`/produtos/apagar/${id}`, { method: 'DELETE' })
    },
    compras: {
        listar: () => apiRequest('/compras/listar').then(r => r.getCompra || []),
        consultarPorPk: (id) => apiRequest(`/compras/consultarPorPk/${id}`).then(r => r.getCompra),
        cadastrar: (dados) => apiRequest('/compras/cadastrar', { method: 'POST', body: JSON.stringify(dados) }),
        atualizar: (id, dados) => apiRequest(`/compras/atualizar/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),
        apagar: (id) => apiRequest(`/compras/apagar/${id}`, { method: 'DELETE' })
    }
};

function showAlert(elementId, message, type = 'success') {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.className = `alert show alert-${type}`;
    setTimeout(() => {
        el.className = 'alert';
    }, 4000);
}
