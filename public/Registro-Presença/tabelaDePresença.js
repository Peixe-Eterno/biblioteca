async function carregarRegistros(startDate = "", endDate = "") {
  // Cria a URL para a API com parâmetros de data (início e fim da semana)
  let url = "/api/frequencia";
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  } else if (startDate) {
    url += `?date=${startDate}`;
  }

  const response = await fetch(url);
  const dados = await response.json();
  const tabela = document.querySelector("#tabelaFrequencia tbody");
  tabela.innerHTML = ""; // Limpa a tabela antes de exibir novos dados

  if (dados.length === 0) {
    // Se não houver registros para a data, mostra uma mensagem na tabela
    tabela.innerHTML = "<tr><td colspan='4'>Nenhum registro encontrado.</td></tr>";
  } else {
    // Preenche a tabela com os dados
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
}

// Função para calcular o início e o fim da semana atual
function getStartAndEndOfWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Segunda-feira, ..., 6 = Sábado

  // Ajustar para que a semana comece na segunda-feira
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // Ajusta para segunda-feira
  startOfWeek.setHours(0, 0, 0, 0); // Ajusta para o início do dia (meia-noite)

  // Fim da semana (domingo)
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() - dayOfWeek + 7); // Ajusta para domingo
  endOfWeek.setHours(23, 59, 59, 999); // Ajusta para o final do dia (23:59:59.999)

  return {
    startOfWeek: startOfWeek.toISOString(),
    endOfWeek: endOfWeek.toISOString(),
  };
}

// Evento para filtrar com base na data selecionada
document.getElementById("selecionarData").addEventListener("change", (e) => {
  const selectedDate = e.target.value;
  if (selectedDate) {
    carregarRegistros(selectedDate); // Chama com a data selecionada
  } else {
    const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
    carregarRegistros(startOfWeek, endOfWeek); // Chama com a data da semana atual
  }
});

// Carregar registros para a semana atual ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();
  carregarRegistros(startOfWeek, endOfWeek);
});
