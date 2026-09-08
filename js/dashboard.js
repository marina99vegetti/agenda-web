const API = "/tasks";

let tarefas = [];

document.addEventListener("DOMContentLoaded", iniciarDashboard);


async function iniciarDashboard() {

    try {

        const resposta = await fetch(API);

        if (!resposta.ok) {
            throw new Error("Não foi possível acessar a API.");
        }

        tarefas = await resposta.json();

        console.log("Tarefas recebidas:", tarefas);

        atualizarIndicadores();
        mostrarProducoes();

    } catch (erro) {

        console.error("Erro no Dashboard:", erro);

        document.getElementById("producoesDashboard").innerHTML = `
            <div class="alert alert-danger">
                Não foi possível carregar as produções.
                <br>
                Verifique se o servidor está rodando.
            </div>
        `;

    }

}


function atualizarIndicadores() {

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(hoje.getMonth() + 1).padStart(2, "0");

    const dia = String(hoje.getDate()).padStart(2, "0");

    const dataHoje = `${ano}-${mes}-${dia}`;


    const producoesHoje = tarefas.filter(
        tarefa => tarefa.date === dataHoje
    );


    const pendentes = tarefas.filter(
        tarefa => tarefa.done !== true
    );


    const concluidas = tarefas.filter(
        tarefa => tarefa.done === true
    );


    const urgentes = tarefas.filter(
        tarefa =>
            tarefa.priority === "urgent" &&
            tarefa.done !== true
    );


    document.getElementById("producoesHoje").textContent =
        producoesHoje.length;


    document.getElementById("pendentes").textContent =
        pendentes.length;


    document.getElementById("concluidas").textContent =
        concluidas.length;


    document.getElementById("urgentes").textContent =
        urgentes.length;

}


function mostrarProducoes() {

    const container =
        document.getElementById("producoesDashboard");


    container.innerHTML = "";


    if (tarefas.length === 0) {

        container.innerHTML = `
            <p class="text-muted">
                Nenhuma produção cadastrada.
            </p>
        `;

        return;
    }


    tarefas.forEach(tarefa => {

        let badge = "";


        if (tarefa.priority === "urgent") {

            badge = `
                <span class="badge bg-danger">
                    Urgente
                </span>
            `;

        } else if (tarefa.priority === "medium") {

            badge = `
                <span class="badge bg-warning text-dark">
                    Média
                </span>
            `;

        } else {

            badge = `
                <span class="badge bg-success">
                    Normal
                </span>
            `;

        }


        const status = tarefa.done
            ? `<span class="badge bg-secondary">Concluída</span>`
            : `<span class="badge bg-primary">Pendente</span>`;


        const div = document.createElement("div");

        div.className = "border rounded p-3 mb-3";


        div.innerHTML = `

            <div class="d-flex justify-content-between align-items-center">

                <div>

                    <h5 class="mb-1">
                        🎬 ${tarefa.title}
                    </h5>

                    <div class="text-muted small">
                        📅 ${tarefa.date}
                    </div>

                </div>


                <div class="d-flex gap-2">

                    ${badge}

                    ${status}

                </div>

            </div>

        `;


        container.appendChild(div);

    });

}