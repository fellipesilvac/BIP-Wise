# 🚀 BIP Wise - Build in Public

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

<br />

Bem-vindo ao **BIP Wise**, uma aplicação moderna e responsiva construída com as melhores práticas de desenvolvimento web. Este projeto foca em uma experiência de usuário (UX) premium, segurança com autenticação robusta e um design system elegante.

## ✨ Funcionalidades

### 🔐 Autenticação & Segurança
- **Login Social**: Integração nativa com **Google** e **Apple**.
- **Email/Senha**: Fluxo completo de cadastro e login seguro via Supabase Auth.
- **Proteção de Rotas**: Middleware inteligente para proteger áreas logadas.
- **Validação**: Feedback visual em tempo real para requisitos de senha.

### 🎨 Design & UI/UX
- **Responsividade Total**: Layout adaptável que se transforma de um painel desktop para uma experiência mobile-first.
- **Mobile Navbar**: Barra de navegação "Liquid Glass" flutuante (estilo iOS) para dispositivos móveis.
- **Animações**: Transições suaves, efeitos de hover e micro-interações.
- **Dark Mode**: Interface imersiva com paleta de cores escuras e acentos vibrantes (#9fe870).

### 🛠 Componentes
- **Profile Dropdown**: Menu de perfil interativo e completo.
- **Service Cards**: Cards de serviços com estados interativos e bloqueados.
- **Toast Notifications**: Notificações globais elegantes com `sonner`.

## 🛠 Tecnologias

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Estilização**: [TailwindCSS](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Deploy**: [Vercel](https://vercel.com/)

## 🚀 Como Rodar o Projeto

1. **Clone o repositório**
   ```bash
   git clone https://github.com/fellipesilvac/BIP-Wise.git
   cd BIP-Wise
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env.local` na raiz do projeto e adicione suas chaves do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_supabase_anon_key
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

<div align="center">
  Feito com 💚 por <a href="https://github.com/fellipesilvac">Fellipe Silva</a>
</div>
