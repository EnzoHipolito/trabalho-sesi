const formUsuario = document.getElementById('formUsuario');
const btnLote = document.getElementById('btnLote');
const bulkStatus = document.getElementById('bulkStatus');

formUsuario.addEventListener('submit', (e) => {
    e.preventDefault();

    const usuario = {
        nome: document.getElementById('nome').value,
        sobrenome: document.getElementById('sobrenome').value,
        idade: Number(document.getElementById('idade').value),
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value
    };

    let ok = false;

    fetch('http://localhost:3000/usuarios/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    })
    .then(res => {
        ok = res.ok;
        return res.json();
    })
    .then(dados => {
        if (!ok) {
            console.error('Erro ao cadastrar usuário:', dados.message);
            return;
        }
        window.location.href = 'usuarios.html';
    })
    .catch(err => {
        console.error('Erro ao cadastrar usuário:', err);
    });
});

btnLote.addEventListener('click', () => {
    btnLote.disabled = true;
    bulkStatus.className = 'bulk-status';
    bulkStatus.textContent = 'Buscando dados na API externa...';

    let ok = false;

    fetch('http://localhost:3000/usuarios/cadastrarEmLote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => {
        ok = res.ok;
        return res.json();
    })
    .then(dados => {
        if (!ok) {
            bulkStatus.className = 'bulk-status erro';
            bulkStatus.textContent = dados.message;
            btnLote.disabled = false;
            return;
        }
        bulkStatus.className = 'bulk-status ok';
        bulkStatus.textContent = dados.message;
        setTimeout(() => { window.location.href = 'usuarios.html'; }, 1200);
    })
    .catch(err => {
        console.error('Erro ao cadastrar usuários em lote:', err);
        bulkStatus.className = 'bulk-status erro';
        bulkStatus.textContent = 'Erro ao cadastrar usuários em lote!';
        btnLote.disabled = false;
    });
});