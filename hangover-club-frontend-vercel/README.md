# Hangover Club Frontend

Frontend do aplicativo Hangover Club, com interface para gerenciamento de usuários, bebidas, eventos e grupos.

## Tecnologias

- Next.js
- React
- Tailwind CSS
- Firebase Authentication
- Firebase Storage

## Requisitos

- Node.js 14 ou superior
- NPM 6 ou superior

## Instalação

```bash
npm install
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
# API Backend
NEXT_PUBLIC_API_URL=https://hangover-club-backend.onrender.com/api

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBvy1MjgKv-t8YTJg2VhT5CpERVj9tyxl8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hangover-club.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hangover-club
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hangover-club.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=765143392713
NEXT_PUBLIC_FIREBASE_APP_ID=1:765143392713:web:5a3eb99181eb8af81d8818
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-CZ51XSTHJM
```

## Executando o Projeto

```bash
npm run dev
```

Para build de produção:

```bash
npm run build
npm start
```

## Implantação na Vercel

Este projeto está configurado para implantação na Vercel. Siga estas etapas:

1. Crie uma conta na Vercel (https://vercel.com)
2. Instale a CLI da Vercel: `npm i -g vercel`
3. Execute `vercel login` e siga as instruções
4. Na raiz do projeto, execute `vercel`
5. Ou conecte seu repositório GitHub à Vercel para implantação automática
6. Configure as variáveis de ambiente listadas acima no painel da Vercel
