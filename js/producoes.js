const API = "https://agenda-api-f6vu.onrender.com/tasks";

let producoes = [];

async function carregarProducoes() {
    const lista = document.getElementById("listaProducoes");

    try {
        const resposta = await fetch(API);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar produções");
        }

        producoes = await resposta.json();

        atualizarContadores();
        mostrarProducoes();

    } catch (erro) {
        console.error(erro);

        lista.innerHTML = `
            <p class="text-danger">
                Erro ao carregar as produções.
            </p>
        `;
    }
}

function atualizarContadores() {
    const total = producoes.length;

    const pendentes = producoes.filter(
        producao => !producao.done
    ).length;

    const concluidas = producoes.filter(
        producao => producao.done
    ).length;

    document.getElementById("totalProducoes").innerText = total;

    document.getElementById("pendentesProducoes").innerText =
        pendentes;

    document.getElementById("concluidasProducoes").innerText =
        concluidas;
}

function mostrarProducoes() {
    const lista = document.getElementById("listaProducoes");

    if (producoes.length === 0) {
        lista.innerHTML = `
            <p class="text-muted">
                Nenhuma produção cadastrada ainda.
            </p>
        `;

        return;
    }

    lista.innerHTML = producoes.map(producao => `
        <div class="col-md-6 col-lg-4">

            <div class="card h-100 shadow-sm border-0">

                <div class="card-body">

                    <div class="d-flex justify-content-between">

                        <h5 class="card-title">
                            ${producao.title}
                        </h5>

                        <span class="badge ${
                            producao.priority === "urgent"
                                ? "text-bg-danger"
                                : producao.priority === "medium"
                                ? "text-bg-warning"
                                : "text-bg-primary"
                        }">
                            ${
                                producao.priority === "urgent"
                                    ? "Urgente"
                                    : producao.priority === "medium"
                                    ? "Média"
                                    : "Normal"
                            }
                        </span>

                    </div>

                    <p class="text-muted mb-2">
                        📅 ${producao.date}
                    </p>

                    <p class="mb-2">
                        🕒 ${producao.time || "Sem horário"}
                    </p>

                    ${
                        producao.obs
                            ? `
                                <p class="small text-muted">
                                    ${producao.obs}
                                </p>
                            `
                            : ""
                    }

                    <span class="badge ${
                        producao.done
                            ? "text-bg-success"
                            : "text-bg-secondary"
                    }">
                        ${
                            producao.done
                                ? "Concluída"
                                : "Pendente"
                        }
                    </span>

                </div>

            </div>

        </div>
    `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
    carregarProducoes();
});
