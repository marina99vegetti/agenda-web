function carregarConfiguracoes() {
    const configuracoes =
        JSON.parse(localStorage.getItem("configuracoes")) || {};

    document.getElementById("nomeAgencia").value =
        configuracoes.nomeAgencia || "STANCE";

    document.getElementById("nomeResponsavel").value =
        configuracoes.nomeResponsavel || "Marina";
}

function salvarConfiguracoes() {
    const nomeAgencia =
        document.getElementById("nomeAgencia").value.trim();

    const nomeResponsavel =
        document.getElementById("nomeResponsavel").value.trim();

    const configuracoes = {
        nomeAgencia: nomeAgencia,
        nomeResponsavel: nomeResponsavel
    };

    localStorage.setItem(
        "configuracoes",
        JSON.stringify(configuracoes)
    );

    alert("Configurações salvas com sucesso! ✅");
}

document.addEventListener(
    "DOMContentLoaded",
    carregarConfiguracoes
);