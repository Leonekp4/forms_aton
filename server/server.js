const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com banco de dados
const db = new sqlite3.Database('./meu_banco.db');

app.get("/", (req, res) => {
    res.send("Api de testes rodando, hendrius é lindo")
})


app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

// rotas post
app.post("/checklists", (req, res) => {
    const { nome, matricula, celula, turno, maquina, gerente, respostas } = req.body;
    const queryChecklist = `INSERT INTO checklists (nome, matricula, celula, turno, maquina, gerente) 
                            VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(queryChecklist, [nome, matricula, celula, turno, maquina, gerente], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const checklistId = this.lastID; // Pega o ID que acabou de ser criado

        // Agora salvamos as respostas
        const queryResposta = `INSERT INTO checklist_respostas (checklist_id, pergunta_index, status, falhas, pergunta_text) VALUES (?, ?, ?, ?, ?)`;
        
        respostas.forEach(resp => {
            // Transformamos o array de falhas em String para o SQLite aceitar
            const falhasString = JSON.stringify(resp.falhas); 
            db.run(queryResposta, [checklistId, resp.pergunta_index, resp.status, falhasString, resp.pergunta_text]);
        });

        res.json({ message: "Checklist salvo com sucesso!", id: checklistId });
    });
});

// rota get 
app.get("/checklists", (req, res) => {
    const query = `
        SELECT 
            c.id,
            c.nome, 
            c.matricula, 
            c.celula, 
            c.turno, 
            c.maquina, 
            c.gerente, 
            c.data_envio,
            -- Agrupa as respostas em um formato JSON legível
            json_group_array(
                json_object(
                    'pergunta', cr.pergunta_text,
                    'status', cr.status,
                    'falhas', cr.falhas
                )
            ) AS detalhes_respostas
        FROM 
            checklists c
        LEFT JOIN 
            checklist_respostas cr ON c.id = cr.checklist_id
        GROUP BY 
            c.id;
    `

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);
    });
});


