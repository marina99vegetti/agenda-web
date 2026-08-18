const API = "http://localhost:3000/tasks";

let tarefas = [];

let anoAtual = new Date().getFullYear();
let mesAtual = new Date().getMonth();

let dataSelecionada = new Date().toISOString().split("T")[0];

const diasCalendario = new Map();

async function buscarTarefas() {
    try {
        const res = await fetch(API);

        if (!res.ok) {
            throw new Error("Erro ao buscar tarefas.");
        }

        tarefas = await res.json();

    } catch (erro) {
        console.error("Erro ao buscar tarefas:", erro);
    }
}

function gerarCalendario() {

    const cal = document.getElementById("calendario");

    if (!cal) return;

    cal.innerHTML = "";

    diasCalendario.clear();

    cal.className = "cal-grid";

    const meses = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    const mesTitulo = document.getElementById("mesTitulo");

    if (mesTitulo) {
        mesTitulo.innerText =
            `${meses[mesAtual]} ${anoAtual}`;
    }

    const totalDias =
        new Date(
            anoAtual,
            mesAtual + 1,
            0
        ).getDate();

    const hoje =
        new Date().toISOString().split("T")[0];

    for (let d = 1; d <= totalDias; d++) {

        const data =
            `${anoAtual}-${String(mesAtual + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

        const box = document.createElement("div");

        box.className = "dia-box";

        if (data === hoje) {
            box.classList.add("hoje");
        }

        const titulo = document.createElement("strong");

        titulo.innerText = d;

        box.appendChild(titulo);

        diasCalendario.set(data, box);

        box.addEventListener("click", () => {

            dataSelecionada = data;

            carregar();

        });

        box.addEventListener("dragover", (e) => {

            e.preventDefault();

            box.classList.add("dragover");

        });

        box.addEventListener("dragleave", () => {

            box.classList.remove("dragover");

        });

        box.addEventListener("drop", moverTarefa);

        cal.appendChild(box);
    }

    atualizarCalendario();
}

function atualizarCalendario() {

    diasCalendario.forEach((box, data) => {

        box
            .querySelectorAll(".evento")
            .forEach(evento => evento.remove());

        tarefas
            .filter(tarefa => tarefa.date === data)
            .forEach(tarefa => {

                const evento =
                    document.createElement("div");

                evento.className =
                    `evento ${tarefa.priority || "normal"}`;

                evento.innerHTML = `
                    <strong>${tarefa.time || "--:--"}</strong>
                    <br>
                    ${tarefa.title}
                `;

                box.appendChild(evento);
            });
    });
}

function mesAnterior() {

    mesAtual--;

    if (mesAtual < 0) {

        mesAtual = 11;

        anoAtual--;
    }

    gerarCalendario();
}

function mesProximo() {

    mesAtual++;

    if (mesAtual > 11) {

        mesAtual = 0;

        anoAtual++;
    }

    gerarCalendario();
}

async function add() {

    const tarefaInput =
        document.getElementById("tarefa");

    const priorityInput =
        document.getElementById("priority");

    const horaInput =
        document.getElementById("hora");

    const obsInput =
        document.getElementById("obs");

    const msg =
        document.getElementById("msg");

    const tarefa =
        tarefaInput
            ? tarefaInput.value.trim()
            : "";

    const priority =
        priorityInput
            ? priorityInput.value
            : "normal";

    const hora =
        horaInput
            ? horaInput.value
            : "";

    const obs =
        obsInput
            ? obsInput.value.trim()
            : "";

    if (!tarefa) {

        if (msg) {

            msg.style.display = "block";

            msg.innerText =
                "Digite uma tarefa!";

        }

        return;
    }

    if (msg) {
        msg.style.display = "none";
    }

    try {

        const res = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                title: tarefa,
                date: dataSelecionada,
                time: hora,
                priority: priority,
                obs: obs

            })

        });

        if (!res.ok) {

            throw new Error(
                "Erro ao salvar produção."
            );

        }

        const nova = await res.json();

        tarefas.push(nova);

        tarefaInput.value = "";

        horaInput.value = "";

        obsInput.value = "";

        priorityInput.value = "normal";

        carregar();

        atualizarCalendario();

        atualizarContador();

    } catch (erro) {

        console.error(
            "Erro ao adicionar produção:",
            erro
        );

        alert(
            "Erro ao salvar a produção."
        );
    }
}

function carregar() {

    const lista =
        document.getElementById("lista");

    if (!lista) return;

    const tarefasDoDia =
        tarefas.filter(
            tarefa =>
                tarefa.date === dataSelecionada
        );

    lista.innerHTML =
        tarefasDoDia.map(tarefa => `

            <div
                class="task ${tarefa.priority || "normal"} ${tarefa.done ? "done" : ""}"
                data-id="${tarefa.id}"
                draggable="true"
            >

                <div class="task-left">

                    <button
                        class="btn-check"
                        onclick="toggle(${tarefa.id})"
                    >
                        ✔
                    </button>

                    <div>

                        <span>
                            ${tarefa.time || "--:--"}
                            -
                            ${tarefa.title}
                        </span>

                        ${
                            tarefa.obs
                                ? `
                                    <small
                                        style="
                                            display:block;
                                            margin-top:4px;
                                            opacity:.7;
                                            font-style:italic;
                                        "
                                    >
                                        ${tarefa.obs}
                                    </small>
                                `
                                : ""
                        }

                    </div>

                </div>

                <div>

                    <button
                        onclick="editar(${tarefa.id})"
                    >
                        ✏️
                    </button>

                    <button
                        onclick="del(${tarefa.id})"
                    >
                        🗑
                    </button>

                </div>

            </div>

        `).join("");

    lista
        .querySelectorAll(".task")
        .forEach(div => {

            div.addEventListener(
                "dragstart",
                e => {

                    e.dataTransfer.setData(
                        "id",
                        div.dataset.id
                    );

                }
            );

        });

    const dataElemento =
        document.getElementById(
            "dataSelecionada"
        );

    if (dataElemento) {

        dataElemento.innerText =
            "Data: " + dataSelecionada;

    }

    atualizarContador();
}

async function toggle(id) {

    const index =
        tarefas.findIndex(
            tarefa => tarefa.id == id
        );

    if (index === -1) return;

    const novoEstado =
        !tarefas[index].done;

    try {

        const res =
            await fetch(
                `${API}/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        done: novoEstado
                    })

                }
            );

        if (!res.ok) {
            throw new Error(
                "Erro ao atualizar."
            );
        }

        tarefas[index].done =
            novoEstado;

        carregar();

        atualizarCalendario();

        atualizarContador();

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao atualizar a produção."
        );
    }
}

async function del(id) {

    const confirmar =
        confirm(
            "Deseja excluir esta produção?"
        );

    if (!confirmar) return;

    try {

        const res =
            await fetch(
                `${API}/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!res.ok) {
            throw new Error(
                "Erro ao excluir."
            );
        }

        tarefas =
            tarefas.filter(
                tarefa =>
                    tarefa.id != id
            );

        carregar();

        atualizarCalendario();

        atualizarContador();

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao excluir a produção."
        );
    }
}

async function editar(id) {

    const index =
        tarefas.findIndex(
            tarefa => tarefa.id == id
        );

    if (index === -1) return;

    const tarefa =
        tarefas[index];

    const novoTitulo =
        prompt(
            "Editar produção:",
            tarefa.title
        );

    if (novoTitulo === null) return;

    const novaHora =
        prompt(
            "Editar hora:",
            tarefa.time || ""
        );

    if (novaHora === null) return;

    const novaObs =
        prompt(
            "Editar observação:",
            tarefa.obs || ""
        );

    if (novaObs === null) return;

    try {

        const res =
            await fetch(
                `${API}/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        title: novoTitulo,
                        time: novaHora,
                        obs: novaObs

                    })

                }
            );

        if (!res.ok) {
            throw new Error(
                "Erro ao editar."
            );
        }

        tarefas[index].title =
            novoTitulo;

        tarefas[index].time =
            novaHora;

        tarefas[index].obs =
            novaObs;

        carregar();

        atualizarCalendario();

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao editar a produção."
        );
    }
}

function atualizarContador() {

    const contador =
        document.getElementById(
            "contador"
        );

    if (!contador) return;

    const total =
        tarefas.length;

    const urgentes =
        tarefas.filter(
            tarefa =>
                tarefa.priority === "urgent" &&
                !tarefa.done
        ).length;

    contador.innerText =
        `${total} produção(ões) • ${urgentes} urgente(s)`;
}

async function moverTarefa(e) {

    e.preventDefault();

    const box =
        e.currentTarget;

    box.classList.remove("dragover");

    const id =
        e.dataTransfer.getData("id");

    if (!id) return;

    let novaData = null;

    diasCalendario.forEach(
        (elemento, data) => {

            if (elemento === box) {
                novaData = data;
            }

        }
    );

    if (!novaData) return;

    const tarefa =
        tarefas.find(
            item => item.id == id
        );

    if (!tarefa) return;

    try {

        const res =
            await fetch(
                `${API}/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        date: novaData
                    })

                }
            );

        if (!res.ok) {

            throw new Error(
                "Erro ao mover produção."
            );

        }

        tarefa.date = novaData;

        carregar();

        atualizarCalendario();

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao mover a produção."
        );
    }
}

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const btnAnterior =
            document.getElementById(
                "btnAnterior"
            );

        const btnProximo =
            document.getElementById(
                "btnProximo"
            );

        if (btnAnterior) {

            btnAnterior.addEventListener(
                "click",
                mesAnterior
            );

        }

        if (btnProximo) {

            btnProximo.addEventListener(
                "click",
                mesProximo
            );

        }

        await buscarTarefas();

        gerarCalendario();

        carregar();

        atualizarContador();

    }
);