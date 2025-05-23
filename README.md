# Meu Chat

Este projeto é um chat em tempo real com autenticação, desenvolvido como estudo prático de integração entre React, Firebase, Express e Socket.IO. O foco principal foi a implementação do backend, autenticação de usuários e comunicação em tempo real via WebSockets, não sendo priorizado o layout ou design visual.

## Objetivo

O objetivo deste projeto é servir como base de estudos para autenticação, persistência de dados e troca de mensagens em tempo real utilizando tecnologias modernas de frontend e backend. O layout foi mantido simples para concentrar esforços na lógica de autenticação, segurança e integração do Socket.IO.

## Funcionalidades

- **Cadastro e Login de Usuários:**  
  Registro e autenticação de usuários via Firebase Authentication (email e senha).

- **Chat em Tempo Real:**  
  Envio e recebimento instantâneo de mensagens usando Socket.IO.

- **Mensagens Persistentes:**  
  Histórico de conversas salvo no Firestore.

- **Lista de Usuários Online:**  
  Exibição em tempo real dos usuários conectados.

- **Logout Seguro:**  
  Encerramento de sessão e desconexão do chat.

- **Feedback Visual:**  
  Notificações de sucesso e erro para ações importantes.

---

## Tecnologias Utilizadas

### Frontend

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase (Auth & Firestore)](https://firebase.google.com/)
- [Socket.IO Client](https://socket.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)

### Backend

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [TypeScript](https://www.typescriptlang.org/)
- [CORS](https://www.npmjs.com/package/cors)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) (para exemplo de autenticação local)

---

## Estrutura do Projeto

```
backend/
  index.ts
  routes/
    auth.ts
  middleware/
    auth.ts
  types/
    express.d.ts
  ...
frontend/
  src/
    App.tsx
    firebase.ts
    api.ts
    pages/
      Login/
      Chat/
    components/
      ChatComponent/
      ToastAlert.tsx
    ...
  ...
```

---

## Como Executar

### 1. Clone o repositório

```sh
git clone https://github.com/LuizHenr1que/meu-chat
cd meu-chat
```

### 2. Configuração do Backend

1. Instale as dependências:
   ```sh
   cd backend
   npm install
   ```
2. Adicione o arquivo de credenciais do Firebase Admin (`chatsocket-1cd90-firebase-adminsdk-fbsvc-aa960d68da.json`) na pasta `backend/`.
3. Inicie o servidor:
   ```sh
   npm run dev
   ```
   O backend estará rodando em `http://localhost:3000`.

### 3. Configuração do Frontend

1. Instale as dependências:
   ```sh
   cd frontend
   npm install
   ```
2. Configure as variáveis de ambiente no arquivo `.env`
3. Inicie o frontend:
   ```sh
   npm run dev
   ```
   O frontend estará disponível em `http://localhost:5173` (ou porta indicada pelo Vite).

---

## Como Usar

1. Acesse o frontend no navegador.
2. Cadastre-se com email e senha ou faça login.
3. Envie mensagens no chat em tempo real.
4. Veja quem está online e o histórico de mensagens.
5. Faça logout quando desejar.

---

## Observações

- O backend utiliza autenticação JWT e validação de token do Firebase para proteger as rotas e conexões do Socket.IO.
- As mensagens são persistidas no Firestore, garantindo histórico mesmo após recarregar a página.
- O projeto prioriza a lógica de autenticação, backend e integração do Socket.IO, não sendo o layout o foco principal.

