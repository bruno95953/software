document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nome = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const tipo = document.getElementById("tipoUsuario").value;

  if (!nome || !senha) {
    alert("Preencha usuário e senha.");
    return;
  }

  try {
    const resposta = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, senha })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      // Salva token e dados no localStorage
      localStorage.setItem("token", dados.token);
      localStorage.setItem("nome", nome);
      localStorage.setItem("tipo", tipo);

      // Redireciona conforme tipo
      if (tipo === "gestor") {
        window.location.href = "gestor/painelgestor.html";
      } else {
        window.location.href = "operador/paineloperador.html";
      }
    } else {
      alert(dados.mensagem || "Usuário ou senha incorretos.");
    }
  } catch (erro) {
    console.error("Erro ao conectar com o backend:", erro);
    alert("Erro ao conectar com o servidor.");
  }
});
