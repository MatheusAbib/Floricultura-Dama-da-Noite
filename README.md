# 🌸 Dama da Noite

**Dama da Noite**, um e-commerce front-end para floricultura, com loja física em Mogi das Cruzes e entrega na região. O projeto usa React, SCSS e Vite, com foco em experiência editorial e navegação fluida.

> 🔗 **Acesse online:** (https://matheusabib.github.io/Floricultura-Dama-da-Noite/)

---

## ✨ Funcionalidades

- 🛒 **Carrinho de compras** com gerenciamento de quantidade e persistência no localStorage
- ❤️ **Sistema de favoritos** com modal de visualização e persistência
- 👤 **Perfil de usuário** com dados editáveis e salvos no localStorage
- 🎠 **Carrossel editorial** com imagens de altura fixa, zoom suave e arco na base
- 📱 **Layout totalmente responsivo** — do desktop ao mobile pequeno (360px)
- 🔍 **Busca, filtro e ordenação** de produtos em tempo real
- 💳 **Fluxo de pagamento** com PIX e Cartão de Crédito
- 🎨 **Paleta terrosa** fechada em variáveis SCSS (terracota, creme, areia, marrom café)
- ✨ **Animações suaves** com FadeIn e transições em `cubic-bezier`
- 📦 **Componentes reutilizáveis** (ProductCard, ProductList, Categories, Newsletter, Footer, Navbar)
- 🛍️ **Modal de produto** com galeria de imagens, zoom, avaliação, estoque e detalhes
- 🔔 **Notificações via PrimeReact Toast** — `success`, `info`, `warn` e `error`, responsivas
- 🧭 **Navbar com menu lateral mobile**, backdrop e submenus acessíveis por toque
- 🎯 **Seções com arcos côncavos/convexos** (Hero → Categories → Products) criando ritmo visual
- 🚀 **Scroll to top** automático ao navegar entre páginas
- 🍞 **Páginas institucionais** (Quem Somos, Contato) com formulário, FAQ e mapa de canais

---

## 🗺️ Páginas

| Rota | Descrição |
|---|---|
| `/` | Home com Hero, Categories, promo banner, ProductList e Newsletter |
| `/quem-somos` | História da loja, endereço e linha do tempo |
| `/contato` | Formulário, canais de atendimento e FAQ |
| `/presentes` | Catálogo de presentes |
| `/vasos` | Catálogo de vasos |
| `/sementes` | Catálogo de sementes |
| `/carrinho` | Carrinho com resumo, dados de entrega e paginação de favoritos |
| `/pagamento` | Pagamento com PIX ou cartão |

---

## 🧰 Tecnologias Utilizadas

<div align="center">
<div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin: 20px 0;">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="60" height="60" title="React"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" width="60" height="60" title="JavaScript"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" alt="Sass" width="60" height="60" title="Sass/SCSS"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" alt="Vite" width="60" height="60" title="Vite"/>
</div>
</div>

### 📦 Principais Bibliotecas

- **React** — construção da interface
- **React Router DOM** — navegação entre páginas (`basename="/Floricultura-Web"`)
- **Sass/SCSS** — arquitetura de estilos por componente + `_variables.scss` central
- **Vite** — build tool e servidor de desenvolvimento
- **PrimeReact** — notificações (Toast)
- **Bootstrap Icons** — ícones (`bi-*`)
- **Bootstrap 5** — grid e utilitários pontuais (`row`, `col-*`, `form-control`)

---
