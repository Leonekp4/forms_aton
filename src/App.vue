<template>
  <div class="container">

    <header class="header">
      <h1>CHECKLIST OPERACIONAL </h1>
      <h2>MAQ DE CORTE ATOM</h2>
      <p>Inspeção na máquina diária pelo operador/liderança.</p>
    </header>

    <form class="form">

      <h2> Usuário / Colaborador </h2>

      <div class="grid">
        <div class="field"> 
          <label>Número de matrícula: </label> 
          <input type="text"> 
        </div>

        <div class="field"> 
          <label>Digite sua célula:</label> 
          <input type="text"> 
        </div>

        <div class="field"> 
          <label>Dia da avaliação:</label> 
          <input type="text"> 
        </div>

        <div class="field"> 
          <label>Coloque seu turno:</label> 
          <input type="text"> 
        </div>
      </div>

      <h2>Checklist operacional</h2>

      <div class="grid2">
        <div class="field"> 
          <label>1 - Verificar emergências, botão, barreiras de luz e portas das pinças: </label> 
          <input type="text">
        </div>

        <div class="field"> 
          <label>2 - Verificar pressão de alimentação da máquina (7 a 8 bar).</label>   
          <input type="text"> 
        </div>

        <div class="field"> 
          <label>3 - Verificar limpeza e lubrificação do mandrino.</label> 
          <input type="text"> 
        </div>

        <div class="field"> 
          <label>4 - Verificar vazador (falta, altura do vazador, colocação de atilhos).</label> 
          <input type="text">
        </div>

        <div class="field"> 
          <label>5 - Verificar a última peça cortada no teste de qualidade (se não tiver item inconforme).</label>
          <input type="text"> 
        </div>

        <div class="field"> 
          <label>6 - Verificar tapete (caso esteja com material item inconforme). </label> 
          <input type="text"> 
        </div>

        <div class="field"> 
          <label>7 - Verificar kit de ferramentas operacionais no setor (chaves, vazadores, lâminas).</label> 
          <input
          type="text"> 
        </div>
      </div>
      
      <button class="btn">Enviar Checklist</button>

    </form>
  </div>
</template>

<script setup>import { ref } from 'vue' </script>

<style scoped>

.container {
  max-width: 100em;
  margin: 0 auto;
  font-family: Arial, Helvetica, sans-serif;
  background-color: white;
}

/* Cabeçalho */
.header {
  background: #9b39cc;
  color: white;
  padding: 10px;
  text-align: center;
}

.header h1 {
  margin-top: 0;
  font-size: 40px;
  color: black;
}

.header h2 {
  margin-top: 0;
  font-size: 24px;
  color: black;
}

.header p {
  margin-top: 8px;
  font-size: 14px;
  color: white;
}

/* Formuário */

.form {
  background: white;
  padding: 30px;
  color: black;
}

.form h2 {
  margin: 25px 0 15px;
  font-size: 18px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 5px;
}

/* Grid de duas colunas */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 40px;
}

.grid2{
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

/* Campo */
.field {
  display: flex;
  flex-direction: column;
}

.field label {
  font-size: 14px;
  margin-bottom: 6px; 
}

/* Inputs arredondados */
.field input {
  padding: 10px;
  border-radius: 20px;
  border: 2px solid #ccc;
  outline: none;
  background-color: rgba(0, 0, 0, 0.212);
  color: black;
}

.field input:focus {
  border-color: #a56cc1;
}

/* Botão */
.btn {
  margin-top: 30px;
  padding: 12px;
  width: 40%;
  border: none;
  border-radius: 25px;
  background: #a56cc1;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.btn:hover {
  background: #8f55a8;
}

</style>