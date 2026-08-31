let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

function salvarClientes() {
    localStorage.setItem("clientes", JSON.stringify(clientes));
}

function adicionarCliente() {
    const nome = document.getElementById("nomeCliente").value.trim();
    const telefone = document.getElementById("telefoneCliente").value.trim();
    const email = document.getElementById("emailCliente").value.trim();

    if (!nome) {
        alert("Digite o nome do cliente!");
        return;
    }

    const cliente = {
        id: Date.now(),
        nome: nome,
        telefone: telefone,
        email: email,
        dataCadastro: new Date().toISOString()
    };

    clientes.push(cliente);

    salvarClientes();
    renderizarClientes();

    document.getElementById("nomeCliente").value = "";
    document.getElementById("telefoneCliente").value = "";
    document.getElementById("emailCliente").value = "";

    const modalElemento = document.getElementById("modalCliente");
    const modal = bootstrap.Modal.getInstance(modalElemento);

    if (modal) {
        modal.hide();
    }
}

function excluirCliente(id) {
    const confirmar = confirm("Deseja excluir este cliente?");

    if (!confirmar) {
        return;
    }

    clientes = clientes.filter(cliente => cliente.id !== id);

    salvarClientes();
    renderizarClientes();
}

function atualizarContadores() {
    const total = clientes.length;

    document.getElementById("totalClientes").innerText = total;

    document.getElementById("clientesAtivos").innerText = total;

    const hoje = new Date().toISOString().split("T")[0];

    const novos = clientes.filter(cliente => {
        const data = cliente.dataCadastro.split("T")[0];
        return data === hoje;
    }).length;

    document.getElementById("novosClientes").innerText = novos;
}

function renderizarClientes() {
    const lista = document.getElementById("listaClientes");

    if (clientes.length === 0) {
        lista.innerHTML = `
            <p class="text-muted">
                Nenhum cliente cadastrado ainda.
            </p>
        `;

        atualizarContadores();
        return;
    }

    lista.innerHTML = clientes.map(cliente => `
        <div class="col-md-6 col-lg-4">

            <div class="card h-100 shadow-sm border-0">

                <div class="card-body">

                    <div class="d-flex justify-content-between align-items-start">

                        <h5>
                            👤 ${cliente.nome}
                        </h5>

                        <button
                            class="btn btn-sm btn-outline-danger"
                            onclick="excluirCliente(${cliente.id})"
                        >
                            🗑️
                        </button>

                    </div>

                    <p class="mb-2">
                        📞 ${cliente.telefone || "Não informado"}
                    </p>

                    <p class="mb-0">
                        ✉️ ${cliente.email || "Não informado"}
                    </p>

                </div>

            </div>

        </div>
    `).join("");

    atualizarContadores();
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarClientes();
});
