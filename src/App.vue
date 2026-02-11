<template>
  <div class="container">
    <header class="header">
      <h1>CHECKLIST OPERACIONAL</h1>
      <h2>MAQ DE CORTE ATOM</h2>
      <p>Inspeção diária realizada pelo operador ou liderança.</p>
    </header>

    <form class="form" @submit.prevent="handleSubmit">
      <section class="user-info">
        <h2>Usuário / Colaborador</h2>
        <div class="grid">
          <div class="field">
            <label>Matrícula:</label>
            <input v-model="formData.usuario.matricula" type="text" placeholder="Digite sua matrícula">
          </div>
          <div class="field">
            <label>Célula:</label>
            <input v-model="formData.usuario.celula" type="text" placeholder="Identifique a célula">
          </div>
          <div class="field">
            <label>Turno:</label>
            <input v-model="formData.usuario.turno" type="text" placeholder="Ex: 1º Turno">
          </div>
          <div class="field">
            <label>Máquina:</label>
            <input v-model="formData.usuario.maquina" type="text" readonly>
          </div>
        </div>
      </section>

      <section class="checklist-section">
        <h2>Checklist Operacional</h2>
        <div class="checklist-grid">
          <div v-for="(item, index) in checklistItems" :key="index" class="item-card">
            
            <div class="item-main">
              <span class="item-text">
                <span class="item-number">{{ index + 1 }}</span>
                {{ item }}
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
                  <label class="checkbox-label">
                    <input type="checkbox" value="a" v-model="formData.respostas[index].falhas">
                    Opção A
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" value="b" v-model="formData.respostas[index].falhas">
                    Opção B
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" value="c" v-model="formData.respostas[index].falhas">
                    Opção C
                  </label>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </section>
      
      <div class="footer-actions">
        <button type="submit" class="btn-submit">Enviar Checklist</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const checklistItems = [
  "Verificar emergências, botão, barreiras de luz e portas das pinças",
  "Verificar pressão de alimentação da máquina (7 a 8 bar)",
  "Verificar limpeza e lubrificação do mandrino",
  "Verificar vazador (falta, altura do vazador, colocação de atilhos)",
  "Verificar a última peça cortada no teste de qualidade",
  "Verificar tapete (material ou item inconforme)",
  "Verificar kit de ferramentas operacionais (chaves, vazadores, lâminas)"
]

// Estado inicial reativo
const formData = reactive({
  usuario: {
    matricula: '',
    celula: '',
    turno: '',
    maquina: 'ATOM'
  },
  respostas: checklistItems.map(() => ({
    status: '', // Armazena 'C' ou 'NC'
    falhas: []  // Armazena ['a', 'b', 'c']
  }))
})

const handleSubmit = () => {
  // Aqui você enviaria os dados para sua API
  console.log("Enviando Dados:", JSON.parse(JSON.stringify(formData)))
  alert("Checklist enviado com sucesso!")
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Segoe UI', Arial, sans-serif;
  background-color: #f9f9f9;
  min-height: 100vh;
}

/* Header */
.header {
  background: #9b39cc;
  color: white;
  padding: 30px 15px;
  text-align: center;
}
.header h1 { margin: 0; font-size: 32px; color: #000; }
.header h2 { margin: 5px 0; font-size: 20px; color: #000; opacity: 0.8; }
.header p { margin-top: 10px; font-size: 14px; }

/* Form */
.form { padding: 20px; }
h2 {
  font-size: 18px;
  color: #444;
  border-bottom: 2px solid #ddd;
  padding-bottom: 8px;
  margin: 30px 0 15px;
}

/* Grid de Usuário */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}
.field { display: flex; flex-direction: column; }
.field label { font-size: 13px; font-weight: bold; margin-bottom: 5px; color: #666; }
.field input {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: #eee;
  outline: none;
}
.field input:focus { border-color: #9b39cc; background-color: #fff; }

/* Checklist Cards */
.item-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  border: 1px solid #eee;
  overflow: hidden;
}

.item-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}

.item-text { font-size: 15px; color: #333; flex: 1; padding-right: 15px; }
.item-number {
  background: #9b39cc;
  color: white;
  padding: 2px 8px;
  border-radius: 6px;
  margin-right: 8px;
  font-weight: bold;
}

/* Seleção C/NC */
.status-selector { display: flex; gap: 10px; }
.status-btn { cursor: pointer; }
.status-btn input { display: none; }
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

.conforme input:checked + .circle {
  background-color: #4CAF50;
  border-color: #4CAF50;
  color: white;
}

.nao-conforme input:checked + .circle {
  background-color: #F44336;
  border-color: #F44336;
  color: white;
}

/* Área Não Conforme */
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
.nc-options { display: flex; gap: 20px; flex-wrap: wrap; }
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
}
.checkbox-label input { width: 18px; height: 18px; cursor: pointer; }

/* Botão Enviar */
.footer-actions { margin-top: 30px; text-align: center; }
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
.btn-submit:hover { background: #812ba3; }

/* Animação */
.slide-enter-active { transition: all 0.3s ease-out; }
.slide-enter-from { opacity: 0; transform: translateY(-10px); }
</style>