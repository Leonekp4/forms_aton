-- Tabela principal
CREATE TABLE checklists (
    id SERIAL PRIMARY KEY,
    nome text,
    matricula VARCHAR(20),
    celula VARCHAR(50),
    turno VARCHAR(20),
    maquina VARCHAR(100),
    gerente VARCHAR(100),
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de respostas (relacionada à principal)
CREATE TABLE checklist_respostas (
    id SERIAL PRIMARY KEY,
    checklist_id INTEGER REFERENCES checklists(id),
    pergunta_index INTEGER,
    status VARCHAR(2), -- 'C' ou 'NC'
    falhas TEXT[]      -- Array de strings para as falhas
);


-- -- Cria a tabela pai (Cabeçalho)
-- CREATE TABLE checklists (
--     id SERIAL PRIMARY KEY,
--     matricula TEXT,
--     celula TEXT,
--     turno TEXT,
--     maquina TEXT,
--     gerente TEXT,
--     data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Cria a tabela filho (Respostas)
-- CREATE TABLE checklist_respostas (
--     id SERIAL PRIMARY KEY,
--     checklist_id INTEGER REFERENCES checklists(id) ON DELETE CASCADE,
--     pergunta_index INTEGER,
--     status VARCHAR(5),
--     falhas TEXT[] -- Suporta o array de falhas do seu Vue
-- );