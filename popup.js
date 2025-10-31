document.getElementById("mudarCor").addEventListener("click", () => {
  // Acessa a API de abas e executa uma função no script de conteúdo (Content Script)
  // Requer a permissão 'activeTab'
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: mudarCorDaPagina,
    });
  });
});

// Esta função é injetada e executada na página da web ativa
function mudarCorDaPagina() {
  document.body.style.backgroundColor = "lightblue";
  console.log("Cor da página alterada pela extensão!");
}
