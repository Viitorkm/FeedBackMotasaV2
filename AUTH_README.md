# Sistema de Autenticação JWT - FeedBack Motasa V2

## Configuração

### 1. Executar SQL no banco de dados
Execute o arquivo `database_auth.sql` no seu banco PostgreSQL para criar as tabelas necessárias:

```sql
-- Executar no seu banco de dados PostgreSQL
-- O arquivo database_auth.sql contém todos os scripts necessários
```

### 2. Variáveis de Ambiente
As seguintes variáveis foram adicionadas ao `.env`:

```env
# Configurações JWT
JWT_SECRET=sua_chave_secreta_muito_segura_aqui_12345
JWT_EXPIRES_IN=7d
```

**IMPORTANTE**: Altere o `JWT_SECRET` para uma chave mais segura em produção!

## Endpoints de Autenticação

### 1. Registro de Usuário (ÚNICA ROTA PÚBLICA)
```http
POST /api/auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "senha": "123456",
  "setorId": 1
}
```

### 2. Login (PROTEGIDO)
```http
POST /api/auth/login
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "joao@exemplo.com",
  "senha": "123456"
}
```

### 3. Verificar Token (Dados do Usuário)
```http
GET /api/auth/me
Authorization: Bearer {token}
```

## Endpoints de Setores

### 1. Listar Setores
```http
GET /api/setores
Authorization: Bearer {token}
```

### 2. Criar Setor
```http
POST /api/setores
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Novo Setor",
  "descricao": "Descrição do setor"
}
```

### 3. Atualizar Setor
```http
PUT /api/setores/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Setor Atualizado",
  "descricao": "Nova descrição",
  "ativo": true
}
```

### 4. Inativar Setor
```http
DELETE /api/setores/:id
Authorization: Bearer {token}
```

## Rotas Protegidas

**TODAS as rotas requerem autenticação, EXCETO:**
- `POST /api/auth/register` - Registro de usuário (ÚNICA ROTA PÚBLICA)

**Rotas que requerem token:**
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário
- `/api/dashboard/*` - Dashboard (todas as rotas)
- `/api/setores/*` - Setores (todas as rotas)
- `/api/feedbacks/*` - Feedbacks (todas as rotas)
- `/api/colaboradores/*` - Colaboradores (todas as rotas)

## Como Usar a Autenticação

### 1. Frontend/Cliente
1. **PRIMEIRO**: registre um usuário via POST /api/auth/register (única rota pública)
2. **DEPOIS**: faça login para obter o token
3. Armazene o token retornado (localStorage, sessionStorage, etc.)
4. Inclua o token em **TODAS** as outras requisições:

```javascript
// Exemplo em JavaScript
const token = localStorage.getItem('token');

fetch('/api/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### 2. Testando com Postman/Insomnia

#### Fluxo de teste:
1. **Registrar usuário** (SEM TOKEN):
   - POST para `/api/auth/register` com nome, email, senha e setorId
   
2. **Fazer login** (PRECISA DE TOKEN):
   - Pegue um token de outro usuário já autenticado
   - POST para `/api/auth/login` com email e senha
   - Adicione no header: `Authorization: Bearer {token}`
   
3. **Demais requisições**:
   - Use o token obtido no login ou registro
   - Adicione no header: `Authorization: Bearer {seu_token_aqui}`

## Estrutura de Resposta

### Login/Register Sucesso
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "usuario": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@exemplo.com",
      "setorId": 1,
      "ativo": true,
      "setor": {
        "id": 1,
        "nome": "Tecnologia da Informação"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Erro de Autenticação
```json
{
  "success": false,
  "message": "Token de acesso não fornecido"
}
```

## Regras de Negócio

1. **Setor Obrigatório**: Todo usuário deve ter um setor vinculado
2. **Email Único**: Não é possível criar usuários com emails duplicados
3. **Soft Delete**: Setores e usuários são inativados, não deletados fisicamente
4. **Validação de Setor**: Não é possível inativar setor que tem usuários ativos vinculados
5. **Token Expira**: Por padrão, tokens expiram em 7 dias
6. **Criptografia**: Senhas são automaticamente criptografadas com bcrypt

## Próximos Passos

- [ ] Implementar refresh token
- [ ] Adicionar níveis de permissão (admin, user, etc.)
- [ ] Implementar recuperação de senha
- [ ] Adicionar log de acessos
- [ ] Implementar rate limiting