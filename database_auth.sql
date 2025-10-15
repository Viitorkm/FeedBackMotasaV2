-- Script SQL para implementação do sistema de autenticação

-- REMOVER TABELAS EXISTENTES (CUIDADO: PERDERÁ DADOS!)
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS setores CASCADE;

-- Criar tabela de setores
CREATE TABLE IF NOT EXISTS setores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    setor_id INTEGER NOT NULL REFERENCES setores(id),
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_setor_id ON usuarios(setor_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON usuarios(ativo);
CREATE INDEX IF NOT EXISTS idx_setores_ativo ON setores(ativo);

-- Inserir setores padrão
INSERT INTO setores (nome, descricao) VALUES
('Recursos Humanos', 'Setor responsável pela gestão de pessoas'),
('Tecnologia da Informação', 'Setor responsável pela infraestrutura tecnológica'),
('Financeiro', 'Setor responsável pela gestão financeira'),
('Comercial', 'Setor responsável pelas vendas e relacionamento com clientes'),
('Operações', 'Setor responsável pelas operações diárias')
ON CONFLICT (nome) DO NOTHING;

-- Criar usuário administrador padrão (senha: admin123)
-- A senha será criptografada pelo sistema quando o usuário for criado via API
-- Este é apenas um exemplo para referência
-- INSERT INTO usuarios (nome, email, senha, setor_id) VALUES
-- ('Administrador', 'admin@sistema.com', '$2a$12$hash_da_senha', 1);

-- Comentários sobre o sistema:
-- 1. A tabela usuarios tem relacionamento obrigatório com setores
-- 2. Tanto usuários quanto setores podem ser inativados (soft delete)
-- 3. As senhas são criptografadas automaticamente pelos hooks do Sequelize
-- 4. O sistema JWT expira em 7 dias por padrão (configurável via .env)

-- Para testar o sistema:
-- 1. Primeiro crie um usuário via POST /api/auth/register
-- 2. Faça login via POST /api/auth/login
-- 3. Use o token retornado no header Authorization: Bearer {token}
-- 4. Acesse rotas protegidas como /api/auth/me