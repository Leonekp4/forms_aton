<template>
  <div class="container">
    <header class="header">
      <h1>CHECKLIST OPERACIONAL</h1>
      <h2>MAQ DE CORTE ATOM</h2>
      <p>Inspeção diária realizada pelo operador ou liderança.</p>
    </header>

    <div class="form">
      <section class="user-info">
        <h2>Usuário / Colaborador</h2>
        <div class="grid">
          <div class="field">
            <label>Matrícula:</label>
            <!-- <input @keyup.enter="buscaDadosColaborador" v-model="formData.usuario.matricula" type="text"
              placeholder="Digite sua matrícula" required> -->
            <input v-model="formData.usuario.matricula" type="text" placeholder="Digite sua matrícula" required>
          </div>

          <div class="field">
            <label>Nome:</label>
            <span class="field">{{ formData.usuario.nome }}</span>
          </div>

          <div class="field">
            <label>Turno:</label>
            <span>{{ formData.usuario.turno }}</span>
          </div>

          <div class="field">
            <label>Gerente:</label>
            <span>{{ formData.usuario.gerente }}</span>
          </div>

          <div class="field">
            <label>Célula:</label>
            <select v-model="formData.usuario.celula" class="custom-select" required>
              <option value="" disabled selected>Selecione a célula</option>
              <option v-for="op in opcoes.celulas" :key="op" :value="op">{{ op }}</option>
            </select>
          </div>

          <div class="field">
            <label>Máquina:</label>
            <select v-model="formData.usuario.maquina" class="custom-select" required>
              <option value="" disabled selected>Selecione a máquina</option>
              <option v-for="op in opcoes.maquinas" :key="op" :value="op">{{ op }}</option>
            </select>
          </div>
        </div>
      </section>

      <section class="checklist-section">
        <h2>Checklist Operacional</h2>
        <div class="checklist-grid">
          <div v-for="(item, index) in checklistData" :key="index" class="item-card">

            <div class="item-main">
              <span class="item-text">
                <span class="item-number">{{ index + 1 }}</span>
                {{ item.pergunta }}
              </span>

              <div class="status-selector">
                <label class="status-btn conforme">
                  <input type="radio" :name="'status-' + index" value="C" v-model="formData.respostas[index].status">
                  <span class="circle">C</span>
                </label>

                <label class="status-btn nao-conforme">
                  <input type="radio" :name="'status-' + index" value="NC" v-model="formData.respostas[index].status">
                  <span class="circle">NC</span>
                </label>
              </div>
            </div>

            <transition name="slide">
              <div v-if="formData.respostas[index].status === 'NC'" class="nc-details">
                <p class="nc-title">Identifique a irregularidade:</p>
                <div class="nc-options">
                  <label v-for="falha in item.opcoesFalha" :key="falha.id" class="checkbox-label">
                    <input type="checkbox" :value="falha.label" v-model="formData.respostas[index].falhas">
                    {{ falha.label }}
                  </label>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </section>

      <div class="footer-actions">
        <button @click="handleSubmit" class="btn-submit">Enviar Checklist</button>

        <button @click="testarApi">Testar api</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import axios from "axios"

// Opções para os campos de seleção
const opcoes = {
  celulas: ["0000", "1111"],
  turnos: ["Turno A", "Turno B", "Turno C"],
  maquinas: [
    "Atom 1 - Pat:0133165",
    "Atom 2 - Pat:0133424",
    "Atom 3 - Pat:0091282",
    "Atom 4 - Pat:0101703",
    "Atom 5 - Pat:0050254",
    "Atom 6 - Pat:0116035",
    "Atom 7 - Pat:0115997",
    "Atom 8 - Pat:0133164"
  ]
}

const checklistData = [
  {
    pergunta: "Verificar emergências, botão, barreiras de luz e portas das pinças",
    opcoesFalha: [
      { id: 'a', label: 'Botão travado' },
      { id: 'b', label: 'Barreira obstruída' },
      { id: 'c', label: 'Porta sem trava' }
    ],
    pergunta_index: 0
  },
  {
    pergunta: "Verificar pressão de alimentação da máquina ( 7 a 8 bar )",
    opcoesFalha: [
      { id: 'a', label: 'Pressão menor que 7 bar' },
      { id: 'b', label: 'Pressão maior que 8 bar' },
      { id: 'c', label: 'Vazamento de ar' }
    ],
    pergunta_index: 1
  },
  {
    pergunta: "Verificar limpeza e lubrificação do mandrino",
    opcoesFalha: [
      { id: 'a', label: 'Limpeza' },
      { id: 'b', label: 'Lubrificação' },
      { id: 'c', label: 'Mandrino' }
    ],
    pergunta_index: 2
  },
  {
    pergunta: "Verificar vazador (falta, altura do vazador, colocação de atilhos)",
    opcoesFalha: [
      { id: 'a', label: 'Vazador faltando' },
      { id: 'b', label: 'Altura incorreta' },
      { id: 'c', label: 'Atilhos gastos' }
    ],
    pergunta_index: 3
  },
  {
    pergunta: "Verificar a última peça cortada no teste de qualidade",
    opcoesFalha: [
      { id: 'a', label: 'Peça com rebarba' },
      { id: 'b', label: 'Medida fora' },
      { id: 'c', label: 'Material rasgado' }
    ],
    pergunta_index: 4
  },
  {
    pergunta: "Verificar tapete (material ou item inconforme)",
    opcoesFalha: [
      { id: 'a', label: 'Tapete danificado' },
      { id: 'b', label: 'Sujeira acumulada' },
      { id: 'c', label: 'Material preso' }
    ],
    pergunta_index: 5
  },
  {
    pergunta: "Verificar kit de ferramentas operacionais (chaves, vazadores, lâminas)",
    opcoesFalha: [
      { id: 'a', label: 'Chave faltando' },
      { id: 'b', label: 'Vazadores faltando' },
      { id: 'c', label: 'Lâminas faltando' }
    ],
    pergunta_index: 6
  }
]

const formData = reactive({
  usuario: {
    matricula: '3020495',
    celula: '3024',
    turno: 'A',
    maquina: 'ATOM 1 - Pat: 0133992',
    gerente: 'gerente2',
    turno: " turno A",
    nome: "npome 2"
  },
  respostas: checklistData.map((perg) => ({
    status: '',
    falhas: [],
    pergunta_index: perg.pergunta_index,
    pergunta_text: perg.pergunta
  }))
})

const handleSubmit = async () => {
  // 1. Verificaer campos do usuário 
  const { matricula, nome, turno, celula, maquina } = formData.usuario
  if (!matricula || !nome || !turno || !celula || !maquina) {
    alert("Por fazor, preencha todos os dados do Usuário")
    return
  }

  // 2 . Veriaficar se todos os itens do checklist foram marcados com (C ou NC)
  const incompleto = formData.respostas.some(resp => resp.status === '')
  if (incompleto) {
    alert("Por favor, responda todos os itens do checklist antes de enviar.")
    return
  }

  // 3. Verificar se os itens NC possuem pelos menos uma opção marcada.
  const semFalhas = formData.respostas.some(resp => resp.status === 'NC' && resp.falhas.length === 0)
  if (semFalhas) {
    alert("Para intens 'Não Conforme', selecione pelo menos uma opção")
    return
  }

  // Se estiver preenchidos todos os itens, envia
  console.log("Dados Enviados:", JSON.parse(JSON.stringify(formData)))

  const payload = {
    nome: formData.usuario.nome,
    matricula: formData.usuario.matricula,
    celula: formData.usuario.celula,
    turno: formData.usuario.turno,
    maquina: formData.usuario.maquina,
    gerente: formData.usuario.gerente,
    respostas: formData.respostas // O array com pergunta_index, status e falhas
  };

  const response = await axios.post("http://localhost:3000/checklists", payload);
  console.log(response.data);
  

  alert(`Checklist enviado com sucesso!`);

  // Limpar formulário
  // limpar dados do usuário
  formData.usuario.matricula = ''
  formData.usuario.nome = ''
  formData.usuario.turno = ''
  formData.usuario.celula = ''
  formData.usuario.maquina = ''

  // limpar as respostas do Checklist
  formData.respostas.forEach(resp => {
    resp.status = ''
    resp.falhas = []
  })
}


async function buscaDadosColaborador() {
  const matricula = formData.usuario.matricula;

  if (!matricula || matricula === 0 || matricula === '') {
    alert("Digite a matrícula para buscar seus dados.")
    return
  }

  if (matricula.length < 7) {
    alert("Digite uma mnatricula válida. Lembre-se de colocar o 30 na frente.")
    return;
  }

  const response = await axios.get(`http://10.100.1.43:2399/colaborador/${matricula}`)
  const dadosColaborador = response.data.data
  const mensagemApi = response.data.message
  alert(mensagemApi)
  console.log(dadosColaborador)

  formData.usuario.nome = dadosColaborador.nome
  formData.usuario.gerente = dadosColaborador.gerente

  try {
    const response = await axios.post("http://seu-ip:3000/salvar-checklist", formData);
    alert("Enviado! Protocolo: " + response.data.id);
  } catch (err) {
    alert("Erro ao salvar dados.");
  }
}

const testarApi = async () => {
  const response = await axios.get("http://localhost:3000/")
  console.log(response.data);
}
</script>

<style scoped>
.custom-select {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: #eee;
  color: black;
  outline: none;
  font-size: 14px;
  cursor: pointer;
  appearance: none;
  /* Remove a seta padrão para estilizar */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 1em;
}

.custom-select:focus {
  border-color: #9b39cc;
  background-color: #fff;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Segoe UI', Arial, sans-serif;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.header {
  background: #9b39cc;
  color: white;
  padding: 30px 15px;
  text-align: center;
}

.header h1 {
  margin: 0;
  font-size: 32px;
  color: #000;
}

.header h2 {
  margin: 5px 0;
  font-size: 20px;
  color: #000;
  opacity: 0.8;
}

.header p {
  margin-top: 10px;
  font-size: 14px;
}

.form {
  padding: 20px;
}

h2 {
  font-size: 18px;
  color: #444;
  border-bottom: 2px solid #ddd;
  padding-bottom: 8px;
  margin: 30px 0 15px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field label {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #666;
}

.field input {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: #eee;
  color: black;
  outline: none;
  font-size: 14px;
}

.field input:focus {
  border-color: #9b39cc;
  background-color: #fff;
  color: black;
}

.item-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
  overflow: hidden;
}

.item-main {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 15px;
  gap: 20px;
}

.item-text {
  font-size: 15px;
  color: #333;
  flex: 1;
  padding-right: 15px;
  text-align: left;
}

.item-number {
  background: #9b39cc;
  color: white;
  padding: 2px 8px;
  border-radius: 6px;
  margin-right: 8px;
  font-weight: bold;
}

.status-selector {
  display: flex;
  gap: 10px;
}

.status-btn {
  cursor: pointer;
}

.status-btn input {
  display: none;
}

.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 2px solid #ccc;
  border-radius: 50%;
  font-weight: bold;
  transition: all 0.2s;
  color: #888;
}

.conforme input:checked+.circle {
  background-color: #4CAF50;
  border-color: #4CAF50;
  color: white;
}

.nao-conforme input:checked+.circle {
  background-color: #F44336;
  border-color: #F44336;
  color: white;
}

.nc-details {
  background-color: #fff5f5;
  padding: 15px;
  border-top: 1px dashed #f44336;
}

.nc-title {
  margin: 0 0 10px 0;
  font-size: 13px;
  font-weight: bold;
  color: #d32f2f;
}

.nc-options {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  color: black;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.footer-actions {
  margin-top: 30px;
  text-align: center;
}

.btn-submit {
  background: #9b39cc;
  color: white;
  border: none;
  padding: 15px 60px;
  border-radius: 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  width: 100%;
  max-width: 400px;
}

.btn-submit:hover {
  background: #812ba3;
}

.slide-enter-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
</style>