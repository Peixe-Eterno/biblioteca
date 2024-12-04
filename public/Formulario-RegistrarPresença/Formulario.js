document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");

  let formulario = document.getElementById("formulario");

  // Verifica se o formulário existe antes de adicionar o evento
  if (formulario) {
    formulario.addEventListener("submit", function(event) {
      event.preventDefault(); // Previne o envio padrão do formulário
      salvar(); // Chama a função 'salvar'
    });
  } else {
    console.error("Form element not found");
  }

  let select = document.querySelector(".select"),
    selectedValue = document.getElementById("select-value"),
    optionsViewButton = document.getElementById("options-view-button"),
    inputOptions = document.querySelectorAll(".option input");

  // Ocultar/mostrar botão "Registrar" quando as opções estão abertas/fechadas
  optionsViewButton.addEventListener("input", () => {
    select.classList.toggle("open");
    const input = document.querySelector(".option input:checked") || document.querySelector(".option input");
    input.focus();
  });

  // Atualizar o valor selecionado quando uma opção for clicada
  inputOptions.forEach((input) => {
    input.addEventListener("click", (event) => {
      selectedValue.textContent = input.dataset.label;
      const isMouseOrTouch = event.pointerType == "mouse" || event.pointerType == "touch";
      if (isMouseOrTouch) {
        optionsViewButton.click();
      }
    });
  });

  // Fechar as opções ao pressionar a tecla ESC ou espaço
  window.addEventListener("keydown", (e) => {
    if (!select.classList.contains("open")) return;
    if (e.key == "Escape" || e.key == " ") {
      optionsViewButton.click();
    }
  });

  // Fechar as opções se clicar fora da área
  document.addEventListener("click", (event) => {
    if (!select.contains(event.target) && select.classList.contains("open")) {
      optionsViewButton.click();
    }
  });

  // **Alteração no evento de limpar o formulário**
  const resetButton = document.getElementById("reset");
  if (resetButton) {
    resetButton.addEventListener("click", limparFormulario);
  }

  // Função para limpar o formulário
  function limparFormulario() {
    formulario.reset();
    // Limpar a seleção de rádio
    const radioButtons = document.querySelectorAll("input[type='radio']");
    radioButtons.forEach((radio) => {
      radio.checked = false;
    });
    // Resetar o texto de "Selecione sua identificação"
    document.getElementById("select-value").textContent = "Selecione sua identificação";
  }

  // Função para salvar os dados do formulário
  async function salvar() {
    const nomeCompleto = document.getElementById('nome').value;
    const identUser = document.getElementById('select-value').textContent;  // Mudado para pegar o texto do selecionado

    const response = await fetch('/registrar-frequencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nomeCompleto, identUser })
    });

    const result = await response.json();
    document.getElementById('resultado').innerText = result.message;
  }
});
