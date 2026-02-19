<template>
  <div class="dashboard-container">
    <header class="header">
      <h1>DASHBOARD OPERACIONAL</h1>
      <h2>MAQ DE CORTE ATOM</h2>
      <p>Acompanhamento e indicadores de inspeções diárias</p>
    </header>

    <div class="content-wrapper">
      <v-row class="kpi-section" dense>
        <v-col cols="12" md="4">
          <div class="kpi-card">
            <div class="kpi-icon">
              <v-icon size="40" color="#9b39cc">mdi-clipboard-text-outline</v-icon>
            </div>
            <div class="kpi-info">
              <h3>Total de Checklists</h3>
              <span class="kpi-value">{{ totalChecklists }}</span>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="4">
          <div class="kpi-card conforme-card">
            <div class="kpi-icon">
              <v-icon size="40" color="#4CAF50">mdi-check-circle-outline</v-icon>
            </div>
            <div class="kpi-info">
              <h3>Total Conformes</h3>
              <span class="kpi-value">{{ totalConformes }}</span>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="4">
          <div class="kpi-card nc-card">
            <div class="kpi-icon">
              <v-icon size="40" color="#F44336">mdi-alert-circle-outline</v-icon>
            </div>
            <div class="kpi-info">
              <h3>Com Não Conformidades</h3>
              <span class="kpi-value">{{ totalNaoConformes }}</span>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row class="charts-section" dense>
        <v-col cols="12" md="6">
          <div class="chart-card">
            <h3 class="chart-title">Status Global (Conformidade)</h3>
            <apexchart type="donut" height="300" :options="chartStatusOptions" :series="chartStatusSeries"></apexchart>
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="chart-card">
            <h3 class="chart-title">Checklists por Máquina</h3>
            <apexchart type="bar" height="300" :options="chartMaquinaOptions" :series="chartMaquinaSeries"></apexchart>
          </div>
        </v-col>
      </v-row>

      <v-row class="charts-section mt-3" dense>
        <v-col cols="12">
          <div class="chart-card">
            <h3 class="chart-title">Principais Ocorrências (Falhas)</h3>
            <apexchart type="bar" height="250" :options="chartFalhasOptions" :series="chartFalhasSeries"></apexchart>
          </div>
        </v-col>
      </v-row>

      <div class="table-section">
        <h2 class="section-title">Histórico de Inspeções</h2>
        <v-card class="custom-table-card" elevation="0">
          <v-data-table
            :headers="headers"
            :items="processedData"
            item-value="id"
            show-expand
            v-model:expanded="expanded"
            class="elevation-0"
            hover
          >
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="item.status === 'Conforme' ? 'success' : 'error'"
                :text-color="item.status === 'Conforme' ? 'white' : 'white'"
                size="small"
                class="font-weight-bold"
              >
                {{ item.status }}
              </v-chip>
            </template>

            <template v-slot:item.turno="{ item }">
              <v-chip color="primary" variant="outlined" size="small">
                {{ item.turno }}
              </v-chip>
            </template>

            <template v-slot:expanded-row="{ columns, item }">
              <tr>
                <td :colspan="columns.length" class="expanded-bg">
                  <div class="expanded-content">
                    <h4 class="expanded-title">Detalhes da Inspeção (ID: {{ item.id }})</h4>
                    <div class="checklist-grid">
                      <div v-for="(resp, idx) in item.respostas" :key="idx" class="item-card">
                        <div class="item-main">
                          <span class="item-text">
                            <span class="item-number">{{ idx + 1 }}</span>
                            {{ resp.pergunta }}
                          </span>
                          <div class="status-badge">
                            <span :class="['circle', resp.status === 'C' ? 'conforme-bg' : 'nc-bg']">
                              {{ resp.status }}
                            </span>
                          </div>
                        </div>

                        <div v-if="resp.status === 'NC'" class="nc-details">
                          <p class="nc-title"><v-icon size="small" color="error" class="mr-1">mdi-alert</v-icon> Falhas Identificadas:</p>
                          <div class="nc-options">
                            <v-chip v-for="(falha, fIdx) in resp.falhasParsed" :key="fIdx" color="error" size="small" variant="flat">
                              {{ falha }}
                            </v-chip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apexchart from 'vue3-apexcharts'

// Dados simulados baseados no retorno da API fornecido
const rawData = ref([
  {
    "id": 26,
    "nome": "HENDRIUS FELIX CERQUEIRA GOMES DE SANTANA",
    "matricula": "3020495",
    "celula": "0000",
    "turno": " turno A",
    "maquina": "Atom 5 - Pat:0050254",
    "gerente": "SERGIO GONCALVES DOS SANTOS",
    "data_envio": "2026-02-18 13:12:21",
    "detalhes_respostas": "[{\"pergunta\":\"Verificar a última peça cortada no teste de qualidade\",\"status\":\"C\",\"falhas\":\"[]\"},{\"pergunta\":\"Verificar emergências, botão, barreiras de luz e portas das pinças\",\"status\":\"C\",\"falhas\":\"[]\"},{\"pergunta\":\"Verificar kit de ferramentas operacionais (chaves, vazadores, lâminas)\",\"status\":\"C\",\"falhas\":\"[]\"},{\"pergunta\":\"Verificar limpeza e lubrificação do mandrino\",\"status\":\"C\",\"falhas\":\"[]\"},{\"pergunta\":\"Verificar pressão de alimentação da máquina ( 7 a 8 bar )\",\"status\":\"C\",\"falhas\":\"[]\"},{\"pergunta\":\"Verificar tapete (material ou item inconforme)\",\"status\":\"C\",\"falhas\":\"[]\"},{\"pergunta\":\"Verificar vazador (falta, altura do vazador, colocação de atilhos)\",\"status\":\"C\",\"falhas\":\"[]\"}]"
  },
  {
    "id": 27,
    "nome": "LEONE BASTOS SANTANA",
    "matricula": "3018962",
    "celula": "0000",
    "turno": " turno A",
    "maquina": "Atom 7 - Pat:0115997",
    "gerente": "SERGIO GONCALVES DOS SANTOS",
    "data_envio": "2026-02-18 13:31:29",
    "detalhes_respostas": "[{\"pergunta\":\"Verificar a última peça cortada no teste de qualidade\",\"status\":\"C\",\"falhas\":\"[]\"},{\"pergunta\":\"Verificar vazador (falta, altura do vazador, colocação de atilhos)\",\"status\":\"NC\",\"falhas\":\"[\\\"Atilhos gastos\\\"]\"},{\"pergunta\":\"Verificar kit de ferramentas operacionais (chaves, vazadores, lâminas)\",\"status\":\"NC\",\"falhas\":\"[\\\"Chave faltando\\\"]\"},{\"pergunta\":\"Verificar limpeza e lubrificação do mandrino\",\"status\":\"NC\",\"falhas\":\"[\\\"Limpeza\\\"]\"},{\"pergunta\":\"Verificar emergências, botão, barreiras de luz e portas das pinças\",\"status\":\"NC\",\"falhas\":\"[\\\"Porta sem trava\\\"]\"},{\"pergunta\":\"Verificar pressão de alimentação da máquina ( 7 a 8 bar )\",\"status\":\"NC\",\"falhas\":\"[\\\"Pressão maior que 8 bar\\\"]\"},{\"pergunta\":\"Verificar tapete (material ou item inconforme)\",\"status\":\"NC\",\"falhas\":\"[\\\"Sujeira acumulada\\\"]\"}]"
  },
  {
    "id": 28,
    "nome": "LEONE BASTOS SANTANA",
    "matricula": "3018962",
    "celula": "0000",
    "turno": "C",
    "maquina": "Atom 7 - Pat:0115997",
    "gerente": "SERGIO GONCALVES DOS SANTOS",
    "data_envio": "2026-02-18 14:14:49",
    "detalhes_respostas": "[{\"pergunta\":\"Verificar a última peça cortada no teste de qualidade\",\"status\":\"C\",\"falhas\":\"[]\"},{\"pergunta\":\"Verificar emergências, botão, barreiras de luz e portas das pinças\",\"status\":\"C\",\"falhas\":\"[]\"},{\"pergunta\":\"Verificar kit de ferramentas operacionais (chaves, vazadores, lâminas)\",\"status\":\"C\",\"falhas\":\"[]\"},{\"pergunta\":\"Verificar limpeza e lubrificação do mandrino\",\"status\":\"C\",\"falhas\":\"[]\"},{\"pergunta\":\"Verificar pressão de alimentação da máquina ( 7 a 8 bar )\",\"status\":\"C\",\"falhas\":\"[]\"},{\"pergunta\":\"Verificar tapete (material ou item inconforme)\",\"status\":\"C\",\"falhas\":\"[]\"},{\"pergunta\":\"Verificar vazador (falta, altura do vazador, colocação de atilhos)\",\"status\":\"C\",\"falhas\":\"[]\"}]"
  }
])

// Variáveis da Tabela
const expanded = ref([])
const headers = [
  { title: 'ID', align: 'start', key: 'id' },
  { title: 'Data/Hora', key: 'data_envio' },
  { title: 'Operador', key: 'nome' },
  { title: 'Máquina', key: 'maquina' },
  { title: 'Turno', key: 'turno' },
  { title: 'Status', key: 'status', align: 'center' },
]

// Processamento de Dados
const processedData = computed(() => {
  return rawData.value.map(item => {
    // Parse the JSON string
    const parsedRespostas = JSON.parse(item.detalhes_respostas).map(resp => {
      let parsedFalhas = []
      try {
        parsedFalhas = JSON.parse(resp.falhas)
      } catch (e) {
        console.error("Erro ao fazer parse das falhas", e)
      }
      return {
        ...resp,
        falhasParsed: parsedFalhas
      }
    })

    const hasNC = parsedRespostas.some(r => r.status === 'NC')

    return {
      ...item,
      turno: item.turno.trim().toUpperCase(),
      respostas: parsedRespostas,
      status: hasNC ? 'Não Conforme' : 'Conforme'
    }
  })
})

// Métricas de KPI
const totalChecklists = computed(() => processedData.value.length)
const totalConformes = computed(() => processedData.value.filter(d => d.status === 'Conforme').length)
const totalNaoConformes = computed(() => processedData.value.filter(d => d.status === 'Não Conforme').length)

// Configuração ApexCharts: Status Global
const chartStatusSeries = computed(() => [totalConformes.value, totalNaoConformes.value])
const chartStatusOptions = {
  chart: { type: 'donut', fontFamily: "'Segoe UI', Arial, sans-serif" },
  labels: ['Conforme', 'Não Conforme'],
  colors: ['#4CAF50', '#F44336'],
  dataLabels: { enabled: true },
  legend: { position: 'bottom' },
  plotOptions: {
    pie: {
      donut: { size: '65%' }
    }
  }
}

// Configuração ApexCharts: Máquinas
const chartMaquinaSeries = computed(() => {
  const contagem = {}
  processedData.value.forEach(d => {
    contagem[d.maquina] = (contagem[d.maquina] || 0) + 1
  })
  return [{
    name: 'Checklists',
    data: Object.values(contagem)
  }]
})

const chartMaquinaOptions = computed(() => {
  const categorias = []
  const contagem = {}
  processedData.value.forEach(d => {
    if (!contagem[d.maquina]) {
      contagem[d.maquina] = 0
      categorias.push(d.maquina.split(' -')[0]) // Pegar apenas o nome curto da maquina
    }
    contagem[d.maquina]++
  })

  return {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: "'Segoe UI', Arial, sans-serif" },
    colors: ['#9b39cc'],
    plotOptions: {
      bar: { borderRadius: 4, horizontal: false, columnWidth: '45%' }
    },
    dataLabels: { enabled: false },
    xaxis: { categories: categorias },
    yaxis: { title: { text: 'Quantidade' } }
  }
})

// Configuração ApexCharts: Principais Falhas
const chartFalhasSeries = computed(() => {
  const ocorrencias = {}
  processedData.value.forEach(checklist => {
    checklist.respostas.forEach(resp => {
      resp.falhasParsed.forEach(falha => {
        ocorrencias[falha] = (ocorrencias[falha] || 0) + 1
      })
    })
  })

  const sortedData = Object.entries(ocorrencias).sort((a, b) => b[1] - a[1])
  return [{
    name: 'Ocorrências',
    data: sortedData.map(item => item[1])
  }]
})

const chartFalhasOptions = computed(() => {
  const ocorrencias = {}
  processedData.value.forEach(checklist => {
    checklist.respostas.forEach(resp => {
      resp.falhasParsed.forEach(falha => {
        ocorrencias[falha] = (ocorrencias[falha] || 0) + 1
      })
    })
  })

  const sortedData = Object.entries(ocorrencias).sort((a, b) => b[1] - a[1])

  return {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: "'Segoe UI', Arial, sans-serif" },
    colors: ['#F44336'],
    plotOptions: {
      bar: { borderRadius: 4, horizontal: true, barHeight: '50%' }
    },
    dataLabels: { enabled: true },
    xaxis: { categories: sortedData.map(item => item[0]) }
  }
})

</script>

<style scoped>
/* Base Styles mirroring the requested UI */
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Arial, sans-serif;
  background-color: #f4f5f7;
  min-height: 100vh;
  padding-bottom: 40px;
}

.header {
  background: #9b39cc;
  color: white;
  padding: 30px 15px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  font-size: 32px;
  color: #000;
  font-weight: 800;
}

.header h2 {
  margin: 5px 0;
  font-size: 20px;
  color: #fff;
  opacity: 0.9;
}

.header p {
  margin-top: 10px;
  font-size: 14px;
  opacity: 0.8;
}

.content-wrapper {
  padding: 0 20px;
}

/* KPI Cards */
.kpi-section {
  margin-bottom: 20px;
}

.kpi-card {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-left: 5px solid #9b39cc;
  height: 100%;
}

.kpi-card.conforme-card {
  border-left-color: #4CAF50;
}

.kpi-card.nc-card {
  border-left-color: #F44336;
}

.kpi-icon {
  background: #f0f0f0;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.kpi-info h3 {
  margin: 0;
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
}

.kpi-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

/* Charts */
.charts-section {
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.chart-title {
  font-size: 16px;
  color: #444;
  border-bottom: 2px solid #ddd;
  padding-bottom: 8px;
  margin-bottom: 15px;
}

/* Data Table */
.table-section {
  margin-top: 30px;
}

.section-title {
  font-size: 18px;
  color: #444;
  border-bottom: 2px solid #ddd;
  padding-bottom: 8px;
  margin-bottom: 15px;
}

.custom-table-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid #eee;
}

.expanded-bg {
  background-color: #fafafa;
  padding: 0 !important;
}

.expanded-content {
  padding: 20px;
  border-left: 4px solid #9b39cc;
}

.expanded-title {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
}

/* Reutilizando estilos do checklist para visualização */
.checklist-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.item-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
  overflow: hidden;
}

.item-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  gap: 15px;
}

.item-text {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.item-number {
  background: #9b39cc;
  color: white;
  padding: 2px 8px;
  border-radius: 6px;
  margin-right: 8px;
  font-weight: bold;
  font-size: 12px;
}

.circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: bold;
  color: white;
  font-size: 14px;
}

.conforme-bg {
  background-color: #4CAF50;
}

.nc-bg {
  background-color: #F44336;
}

.nc-details {
  background-color: #fff5f5;
  padding: 12px 15px;
  border-top: 1px dashed #f44336;
}

.nc-title {
  margin: 0 0 10px 0;
  font-size: 13px;
  font-weight: bold;
  color: #d32f2f;
  display: flex;
  align-items: center;
}

.nc-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>