const producoes = JSON.parse(localStorage.getItem("producoes")) || [];
const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

function carregarRelatorios() {
    const totalProducoes = producoes.length;

    const producoesConcluidas = producoes.filter(producao =>
        producao.concluida === true
    ).length;

    const totalClientes = clientes.length;

    document.getElementById("relatorioProducoes").innerText =
        totalProducoes;

    document.getElementById("relatorioConcluidas").innerText =
        producoesConcluidas;

    document.getElementById("relatorioClientes").innerText =
        totalClientes;

    const resumo = document.getElementById("resumoRelatorio");

    resumo.innerHTML = `
        <p>
            📌 Atualmente a STANCE possui
            <strong>${totalProducoes}</strong> produção(ões)
            cadastrada(s).
        </p>

        <p>
            ✅ Destas, 
            <strong>${producoesConcluidas}</strong>
            estão concluídas.
        </p>

        <p>
            👥 Existem
            <strong>${totalClientes}</strong>
            cliente(s) cadastrado(s).
        </p>
    `;
}

document.addEventListener("DOMContentLoaded", carregarRelatorios);
