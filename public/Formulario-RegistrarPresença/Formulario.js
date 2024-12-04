document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");

  let formulario = document.getElementById("formulario");

  // Verifica se o formulário existe antes de adicionar o evento
  if (formulario) {
    formulario.addEventListener("submit", function(event) {
      event.preventDefault(); // Previne o envio padrão do formulário

      // Chama a função 'salvar' (você pode definir esta função em algum lugar no seu código)
      salvar(); 
    });
  } else {
    console.error("Form element not found");
  }

  // Outras partes do seu código, como a manipulação de seleção de identificação, etc.
  let select = document.querySelector(".select"),
    selectedValue = document.getElementById("select-value"),
    optionsViewButton = document.getElementById("options-view-button"),
    inputOptions = document.querySelectorAll(".option input");

  // Ocultar/mostrar botão "Registrar" quando as opções estão abertas/fechadas
  optionsViewButton.addEventListener("input", () => {
    select.classList.toggle("open");

    const input =
      document.querySelector(".option input:checked") ||
      document.querySelector(".option input");

    input.focus();
  });

  // Atualizar o valor selecionado quando uma opção for clicada
  inputOptions.forEach((input) => {
    input.addEventListener("click", (event) => {
      selectedValue.textContent = input.dataset.label;

      const isMouseOrTouch =
        event.pointerType == "mouse" || event.pointerType == "touch";

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

  // Função para limpar o formulário (se necessário)
  function limparFormulario() {
    // Limpar o formulário
    formulario.reset();
    // Limpar a seleção de rádio
    const radioButtons = document.querySelectorAll("input[type='radio']");
    radioButtons.forEach((radio) => {
      radio.checked = false;
    });
    // Resetar o texto de "Selecione sua identificação"
    document.getElementById("select-value").textContent = "Selecione sua identificação";
  }
  
  // Se necessário, adicionar lógica para salvar os dados do formulário (função 'salvar')
  async function salvar() {
    const nomeCompleto = document.getElementById('nome').value;
    const identUser = document.getElementById('select-value').value;

    const response = await fetch('/registrar-frequencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeCompleto, identUser })
    });

    const result = await response.json();
    document.getElementById('resultado').innerText = result.message;
}
});
