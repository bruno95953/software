const maquinaSelect = document.getElementById('maquina');
const pecaSelect = document.getElementById('peca');
const btnIniciar = document.getElementById('btnIniciar');

// Dados de exemplo de peças por máquina (ideal puxar do backend depois)
const pecasPorMaquina = {
  maq1: [
    { id: '4397', nome: 'Engrenagem Redutor 2' },
    { id: '4521', nome: 'Eixo Principal' },
  ],
  maq2: [
    { id: '3345', nome: 'Polia de Correia' },
    { id: '3399', nome: 'Roda Dentada' },
  ],
  maq3: [
    { id: '2211', nome: 'Carcaça Motor' },
  ],
};

maquinaSelect.addEventListener('change', () => {
  const maquina = maquinaSelect.value;
  pecaSelect.innerHTML = '<option value="">-- Selecione a peça --</option>';

  if (maquina && pecasPorMaquina[maquina]) {
    pecasPorMaquina[maquina].forEach(peca => {
      const option = document.createElement('option');
      option.value = peca.id;
      option.textContent = peca.nome;
      pecaSelect.appendChild(option);
    });
    pecaSelect.disabled = false;
  } else {
    pecaSelect.disabled = true;
  }

  btnIniciar.disabled = true;
});

pecaSelect.addEventListener('change', () => {
  btnIniciar.disabled = !pecaSelect.value;
});

btnIniciar.addEventListener('click', () => {
  const maquina = maquinaSelect.value;
  const peca = pecaSelect.value;
  const etapa = 1;

  window.location.href = `producao.html?maquina=${maquina}&peca=${peca}&etapa=${etapa}`;
});
