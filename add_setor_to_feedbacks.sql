-- SQL para adicionar campos setor_id e colaborador_id na tabela feedbacks

-- Adicionar a coluna setor_id na tabela feedbacks
ALTER TABLE feedbacks 
ADD COLUMN IF NOT EXISTS setor_id INTEGER;

-- Adicionar a coluna colaborador_id na tabela feedbacks
ALTER TABLE feedbacks 
ADD COLUMN IF NOT EXISTS colaborador_id INTEGER;

-- Adicionar as foreign key constraints
ALTER TABLE feedbacks 
ADD CONSTRAINT fk_feedbacks_setor 
FOREIGN KEY (setor_id) REFERENCES setores(id);

ALTER TABLE feedbacks 
ADD CONSTRAINT fk_feedbacks_colaborador 
FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_feedbacks_setor_id ON feedbacks(setor_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_colaborador_id ON feedbacks(colaborador_id);

-- Comentários sobre as mudanças:
-- 1. O campo setor_id é opcional (nullable) para associar feedback a um setor específico
-- 2. O campo colaborador_id é opcional (nullable) para associar feedback a um colaborador específico
-- 3. Feedbacks existentes ficarão com ambos campos = NULL até serem atualizados
-- 4. Novos feedbacks podem ter setor e/ou colaborador associados