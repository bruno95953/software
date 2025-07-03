// 👉 Função para obter o parâmetro "codigo" da URL
function getCodigoFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('codigo');
}

// 👉 Função para carregar o PDF na tela
async function carregarPDF(codigo) {
  if (!codigo) {
    alert("Código do PDF não informado na URL.");
    return;
  }

  const url = `pdf/${codigo}.pdf`;

  try {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1 });

    const maxWidth = window.innerWidth * 0.6;
    const maxHeight = window.innerHeight * 0.75;

    const scaleX = maxWidth / viewport.width;
    const scaleY = maxHeight / viewport.height;
    const scale = Math.min(scaleX, scaleY);

    const scaledViewport = page.getViewport({ scale });

    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;

    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport
    };

    await page.render(renderContext).promise;

  } catch (error) {
    alert("Erro ao carregar o PDF.");
    console.error(error);
  }
}

// 👉 Variáveis de controle de produção
let inicioProducao = null;
let intervaloTempo = null;
let producaoInicial = 0;
let producaoFinal = 0;

const btnIniciar = document.getElementById('btn-iniciar');
const btnFechar = document.getElementById('btn-fechar');

// 🧠 Função reutilizável para pedir número ao usuário (usada no início e fim da produção)
async function solicitarNumero(mensagem, min = 0) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'overlay-modal';

    overlay.innerHTML = `
      <div class="modal">
        <h3>${mensagem}</h3>
        <input type="number" id="input-modal" min="${min}" />
        <div class="botoes-modal">
          <button id="confirmar">Confirmar</button>
          <button id="cancelar">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('confirmar').onclick = () => {
      const valor = parseInt(document.getElementById('input-modal').value);
      if (isNaN(valor) || valor < min) {
        alert(`Digite um número válido (mínimo: ${min})`);
        return;
      }
      document.body.removeChild(overlay);
      resolve(valor);
    };

    document.getElementById('cancelar').onclick = () => {
      document.body.removeChild(overlay);
      resolve(null);
    };
  });
}

// ▶ Evento do botão "Iniciar Produção"
btnIniciar.addEventListener('click', async () => {
  const input = await solicitarNumero("🔰 Digite a produção atual (início):", 0);
  if (input === null) return;

  producaoInicial = input;
  inicioProducao = new Date();
  btnIniciar.disabled = true;
  btnFechar.disabled = false;

  console.log("🟢 Produção iniciada:", inicioProducao.toLocaleString());
  console.log(`📦 Produção inicial: ${producaoInicial}`);
});

// ⛔ Evento do botão "Fechar Produção"
btnFechar.addEventListener('click', async () => {
  const input = await solicitarNumero("🏁 Digite a produção final:", producaoInicial);
  if (input === null) return;

  producaoFinal = input;
  const fimProducao = new Date();

  // ⏱️ Tempo total de produção
  const tempoTotalSegundos = Math.floor((fimProducao - inicioProducao) / 1000);
  const minutos = Math.floor(tempoTotalSegundos / 60);
  const segundos = tempoTotalSegundos % 60;

  // 📊 Cálculo da eficiência
  const quantidadeProduzida = producaoFinal - producaoInicial;
  const tempoEsperado = quantidadeProduzida * 10; // 10 segundos por peça
  const eficiencia = (quantidadeProduzida / (tempoTotalSegundos / 10)) * 100;

  // 🔄 Atualiza o indicador com base na eficiência
  atualizarIndicadorEficiencia(eficiencia);

  // 🧾 Logs e mensagem final
  console.log("🔴 Produção encerrada:", fimProducao.toLocaleString());
  console.log(`⏱️ Tempo total: ${minutos}m ${segundos}s`);
  console.log(`⚙️ Produzido: ${quantidadeProduzida} peças`);
  console.log(`📈 Eficiência: ${eficiencia.toFixed(2)}%`);

 
  btnIniciar.disabled = false;
  btnFechar.disabled = true;
});

// ✅ Atualiza o indicador circular com base no valor de eficiência
function atualizarIndicadorEficiencia(valor) {
  const percentual = Math.max(0, Math.floor(valor));
  const progress = Math.min(valor, 100);

  const circulo = document.querySelector('.barra');
  const textoValor = document.getElementById('texto-valor');

  const raio = 45;
  const circunferencia = 2 * Math.PI * raio;
  const offset = circunferencia - (progress / 100) * circunferencia;

  circulo.style.strokeDasharray = `${circunferencia}`;
  circulo.style.strokeDashoffset = offset;
  circulo.style.stroke = valor >= 90 ? '#28a745' : '#dc3545'; // verde se >= 90%, vermelho se <

  textoValor.textContent = `${percentual}%`;
}

// 🎛️ Slider manual para simulação (opcional)
document.getElementById('slider').addEventListener('input', function () {
  atualizarIndicadorEficiencia(this.value);
});

// 🚀 Quando a página carregar, já carrega o PDF e define o valor inicial
window.onload = () => {
  const codigo = getCodigoFromURL();
  carregarPDF(codigo);
  atualizarIndicadorEficiencia(90); // valor inicial
  btnIniciar.disabled = false;
  btnFechar.disabled = true;
};
// Atualiza o código da peça exibido no cartão
function atualizarCodigoPeca(codigo) {
  const codigoElem = document.getElementById('codigo-peca');
  codigoElem.textContent = codigo;
}

// Atualiza o tempo de usinagem exibido no cartão
function atualizarTempoUsinagem(tempo) {
  const tempoElem = document.getElementById('tempo-usinagem');
  tempoElem.textContent = tempo;
}

// Atualiza a quantidade produzida exibida no cartão
function atualizarQuantidadeProduzida(qtd) {
  const qtdElem = document.getElementById('quantidade-produzida');
  qtdElem.textContent = `${qtd} unidades`;
}

// Atualiza a hora de início exibida no cartão
function atualizarHoraInicio(horaStr) {
  const horaElem = document.getElementById('hora-inicio');
  horaElem.textContent = horaStr;
}

function atualizarRelogio() {
  const agora = new Date();
  const hora = agora.toLocaleTimeString();
  const data = agora.toLocaleDateString('pt-BR');

  document.getElementById('hora').textContent = hora;
  document.getElementById('data').textContent = data;
}

setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// Pega o parâmetro "codigo" da URL
const urlParams = new URLSearchParams(window.location.search);
const maquina = urlParams.get('maquina');
const codigo = urlParams.get('peca');  // nome diferente só pra organizar
const etapa = urlParams.get('etapa');


if (codigo) {
  fetch(`dados/${codigo}.json`)
    .then(response => {
      if (!response.ok) throw new Error('Arquivo JSON não encontrado');
      return response.json();
    })
    .then(data => {
      console.log('Dados carregados:', data);
      
      // Atualize o painel com dados da peça
      atualizarCodigoPeca(`${codigo} - ${data.nome || 'Nome da peça'}`);

      // Atualize a etapa com o parâmetro da URL
      if (etapa) {
        document.getElementById('etapa').textContent = etapa + 'º';
      }

      // Aqui você pode atualizar outras coisas como máquina, etc
      console.log('Máquina:', maquina);

    })
    .catch(err => {
      console.error('Erro ao carregar JSON:', err);
      alert('Erro ao carregar os dados da peça!');
    });
} else {
  alert('Código da peça não informado na URL!');
}
// Função para pegar parâmetro da URL
function getParametro(nome) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(nome);
}

async function carregarDados() {
  const peca = getParametro('peca');
  if (!peca) {
    document.getElementById('dadosProducao').innerHTML = "<p>Peça não informada na URL.</p>";
    return;
  }

  try {
    // Caminho do JSON baseado no parâmetro da peça
    const response = await fetch(`dados/${peca}.json`);
    if (!response.ok) throw new Error('Erro ao carregar dados da peça.');

    const dados = await response.json();

    // Montar HTML com os dados e a imagem
    const html = `
      <p><strong>Código Peça:</strong><br> ${dados.codigo}</p>
      <p><strong>Tempo de Usinagem:</strong><br> ${dados.tempo}</p>
      <p><strong>Meta:</strong><br> ${dados.meta}</p>
      <p><strong>Produzido:</strong><br> ${dados.produzido}</p>
      <p><strong>Início:</strong><br> ${dados.inicio}</p>
      <p><strong>Etapa:</strong><br> ${dados.etapa}</p>
      <img src="${dados.desenho}" alt="Desenho técnico da peça" class="desenho" />
    `;

    document.getElementById('dadosProducao').innerHTML = html;

  } catch (error) {
    document.getElementById('dadosProducao').innerHTML = `<p>Erro ao carregar dados: ${error.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', carregarDados);


