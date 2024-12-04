async function carregarRegistros() {
  const response = await fetch("/api/frequencia");
  const dados = await response.json();
  const tabela = document.querySelector("#tabelaFrequencia tbody");
  tabela.innerHTML = ""; // Limpa a tabela antes de exibir novos dados

  dados.forEach((item) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
            <td>${item.ID_User}</td>
            <td>${item.NomeCompleto}</td>
            <td>${item.Ident_User}</td>
            <td>${new Date(item.DataHoraMomento).toLocaleString()}</td>
        `;
    tabela.appendChild(linha);
  });
}

// Carregar registros ao abrir a página
carregarRegistros();
