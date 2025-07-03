// Evento para clique nos ícones (exemplo produção)
document.querySelectorAll('.icon img').forEach(img => {
  img.addEventListener('click', () => {
    if (img.alt.toLowerCase() === 'producao') {
      // Redireciona direto para a página selecionar.html dentro da pasta producao
      window.location.href = 'producao/selecionar.html';
    }
  });
});

// O resto do seu código (ex: autenticação, carregamento de dados) permanece igual
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você não está autenticado.");
    window.location.href = "../index.html";
    return;
  }

  try {
    const resposta = await fetch("http://localhost:3000/painel-operador", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      document.getElementById("nome-operador").innerText = dados.nome;
    } else {
      alert(dados.mensagem || "Sessão expirada.");
      localStorage.removeItem("token"); // limpa token inválido
      window.location.href = "../index.html";
    }

  } catch (erro) {
    console.error("Erro ao buscar dados do operador:", erro);
    alert("Erro ao conectar com o servidor.");
    window.location.href = "../index.html";
  }
});
