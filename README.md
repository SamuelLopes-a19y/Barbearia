# Sistema de Gestão para Barbearia

Este projeto consiste em uma aplicação web completa (Fullstack) desenvolvida para a gestão eficiente de uma barbearia. O sistema permite o controle de agendamentos, cadastro de clientes, gerenciamento de estoque de produtos, histórico de atendimentos e controle de vendas.

A arquitetura do sistema foi dividida em duas camadas principais:

- **Backend (API RESTful):** Construído com Node.js, Express e MongoDB Atlas.

- **Frontend (Interface de Usuário):** Desenvolvido com React.js, Vite e CSS puro.

---

## Como Executar o Projeto

Para executar o projeto corretamente na sua máquina local, siga os passos abaixo:

### 1. Pré-requisitos

Certifique-se de ter os seguintes softwares instalados em seu computador:

- **Node.js** (versão 18 ou superior recomendada)

- **npm** (gerenciador de pacotes, geralmente vem com o Node.js)

- Conta no **MongoDB Atlas** (para o banco de dados)

### 2. Clonar/Descompactar o Projeto

Se você recebeu o projeto em formato ZIP, descompacte-o em uma pasta de sua preferência.

### 3. Configuração do Backend

1. Navegue até a pasta do backend:

   ```bash
   cd "Trabalho Final - BD2/backend"
   ```

1. Instale as dependências do Node.js:

   ```bash
   npm install
   ```

1. Configure as variáveis de ambiente:
  - Copie o arquivo `.envexemplo` para `.env`.
    - Edite o arquivo `.env` e adicione sua string de conexão do MongoDB Atlas:
    
       ```
       CONNECTIONSTRING=sua_string_de_conexao_aqui
       TOKEN_SECRET=sua_chave_secreta_jwt
       PORT='3001'
       TOKEN_EXPIRATION=1d
       DB_NAME=Barbearia
       ```

1. (Opcional) Popular o banco de dados com dados de teste:

   ```bash
   node src/seed.js
   ```

1. Inicie o servidor backend:

   ```bash
   npm run dev
   ```

   O servidor estará rodando na porta `3001`.

### 4. Configuração do Frontend

1. Abra um **novo terminal** e navegue até a pasta do frontend:

   ```bash
   cd "Trabalho Final - BD2/frontend"
   ```

1. Instale as dependências do React:

   ```bash
   npm install
   ```

1. Inicie a aplicação frontend:

   ```bash
   npm run dev
   ```

   O Vite fornecerá um endereço local (geralmente `http://localhost:5173` ) para você acessar a aplicação no navegador.

---

## Arquitetura e Tecnologias

### Backend

- **Linguagem:** JavaScript (Node.js)

- **Framework:** Express.js

- **Banco de Dados:** MongoDB Atlas (Driver `mongodb` v6)

- **Autenticação:** JWT (JSON Web Token) e `bcryptjs` para hashing de senhas

- **Estrutura:** Arquitetura MVC (Model, View, Controller) com Repositórios

### Frontend

- **Biblioteca:** React.js (versão 19)

- **Build Tool:** Vite

- **Estilização:** CSS Modules e Variáveis CSS (Design System próprio com cor primária `#F05A11`)

- **Ícones:** Lucide React

- **Gerenciamento de Estado:** React Context API

---

## Perfis de Usuário e Funcionalidades

O sistema possui um login unificado com três tipos de perfis, cada um com permissões e visões diferentes:

### 1. Administrador

- Visualiza o Dashboard principal.

- Tem acesso completo à Gestão de Usuários (Clientes, Barbeiros e Atendentes).

- Gerencia Agendamentos.

- Visualiza o Histórico completo de Clientes (incluindo compras e atendimentos).

- Gerencia o Estoque de produtos.

### 2. Atendente

- Visualiza o Dashboard principal.

- Gerencia Usuários (Clientes, Barbeiros e Atendentes).

- Cria e gerencia Agendamentos.

- Realiza vendas de produtos e gerencia o Estoque.

### 3. Barbeiro

- Visualiza o Dashboard principal.

- Visualiza o Histórico de Clientes (com foco nos agendamentos e serviços realizados).

---

## Estrutura de Pastas

```
Trabalho Final - BD2/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Lógica de negócio
│   │   ├── middlewares/    # Autenticação e autorização
│   │   ├── models/         # Modelos de dados
│   │   ├── repositories/   # Acesso ao banco de dados
│   │   ├── routes/         # Definição de rotas da API
│   │   ├── database.js     # Conexão com MongoDB
│   │   ├── seed.js         # Script para popular o banco
│   │   ├── server.js       # Ponto de entrada do backend
│   │   └── app.js          # Configuração do Express
│   ├── .env                # Variáveis de ambiente
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/     # Componentes React
    │   ├── context/        # Context API
    │   ├── styles/         # Arquivos CSS
    │   ├── App.jsx         # Componente raiz
    │   └── main.jsx        # Ponto de entrada do frontend
    └── package.json
```