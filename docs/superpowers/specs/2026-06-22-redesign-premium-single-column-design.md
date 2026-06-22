# AjuriIA — Redesign Premium Single Column

**Data:** 2026-06-22
**Status:** Aprovado

## Contexto

O frontend atual tem três problemas centrais:

1. **Markdown sem estilo**: `@tailwindcss/typography` não está instalado, então as classes `prose prose-invert` no `StreamingText.vue` não produzem nenhum efeito. O markdown é parseado corretamente pelo `marked` + `DOMPurify`, mas o HTML resultante fica sem tipografia adequada.
2. **Layout comprimido**: Cards do `HomeView` têm pouco respiro, especialmente no mobile. O grid existe mas os cartões parecem pequenos.
3. **ChatView sem hierarquia premium**: Input discreto demais, estado vazio fraco, bolhas sem personalidade, fontes não carregadas (Inter e Playfair Display referenciadas mas sem `<link>` no HTML).

## Decisões de design

- **Dispositivos:** Mobile e desktop com peso igual (responsive-first, não mobile-only)
- **Estilo:** Redesign completo mantendo a temática amazônica (verde-mata, âmbar, areia), mas com identidade visual premium
- **Layout de chat:** Single column centrada (max 768px), como Claude.ai ou Perplexity — elegante nos dois dispositivos sem a complexidade de uma sidebar

## Arquivos alterados

```text
index.html                        ← importar Google Fonts (Inter + Playfair Display)
src/assets/main.css               ← @plugin typography + redesign de variáveis e tema prose
src/views/HomeView.vue            ← novo hero + grid de perfis
src/views/ChatView.vue            ← novo layout de chat premium
src/components/ProfileCard.vue    ← novo card horizontal com hover
src/components/ChatBubble.vue     ← novas bolhas com avatar e hierarquia
src/components/StreamingText.vue  ← habilitar prose com plugin, remover :deep() redundantes
```

Nenhum componente novo, nenhuma rota nova, nenhum composable alterado.

## Seção 1 — Tecnologia

### Dependência nova

```bash
npm install @tailwindcss/typography
```

O projeto usa **Tailwind CSS v4** com `@tailwindcss/vite`. Nessa versão, plugins são registrados com a diretiva `@plugin` no CSS — **não** no `vite.config.js`. Adicionar no topo de `src/assets/main.css`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

O `vite.config.js` não precisa ser alterado.

### Google Fonts

Adicionar em `index.html` antes do `</head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
```

## Seção 2 — HomeView

### Layout

```text
┌─────────────────────────────────────┐
│           [Hero]                    │
│     AjuriIA  (Playfair, grande)     │
│     Subtítulo (Inter, opacity-70)   │
│     ─────── separador âmbar ─────── │
├─────────────────────────────────────┤
│   [Grid max-w-5xl mx-auto]          │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │ Card │ │ Card │ │ Card │  lg: 3  │
│  └──────┘ └──────┘ └──────┘        │
│  ┌──────┐ ┌──────┐                 │
│  │ Card │ │ Card │         sm: 2   │
│  └──────┘ └──────┘                 │
│  ┌─────────────────────┐           │
│  │        Card         │  xs: 1   │
│  └─────────────────────┘           │
└─────────────────────────────────────┘
```

### Hero

- `"AjuriIA"` em Playfair Display, `text-6xl` (mobile) / `text-8xl` (desktop)
- Gradiente de texto âmbar→areia via `background-clip: text`
- Subtítulo Inter `text-base` / `text-lg`, `opacity-70`, `max-w-sm mx-auto`
- Separador: linha `<hr>` com `border-guarana/20`, largura `max-w-xs mx-auto`
- Padding vertical generoso: `py-16` mobile, `py-24` desktop

### ProfileCard

Layout horizontal: ícone à esquerda, texto à direita.

```text
┌──────────────────────────────────────┐
│  [●]  Nome do Perfil                 │
│  56px  Descrição curta               │
└──────────────────────────────────────┘
```

- Container: `glass-card p-6 sm:p-8 flex items-center gap-5`
- Ícone: `w-14 h-14 rounded-full`, fundo `rgba(45,106,79,0.5)`, borda âmbar sutil
- Nome: Playfair Display `text-lg font-semibold text-areia`
- Descrição: Inter `text-sm opacity-70`
- Hover: `translateY(-3px)` + borda âmbar intensa + `box-shadow: 0 8px 32px rgba(224,123,57,0.25)`
- Transição: `all 300ms ease`
- Animação de entrada: `fadeSlideUp` com delay escalonado por índice (já existente)

## Seção 3 — ChatView

### Layout geral

```text
┌─────────────────────────────────────┐
│  [Header glass h-14]                │
│  ← Voltar    [ícone] Nome           │
├─────────────────────────────────────┤
│  [main flex-1 overflow-y-auto]      │
│                                     │
│     max-w-2xl mx-auto               │
│                                     │
│  ┌─ Estado vazio (se sem mensagens) ┐│
│  │  [ícone grande]                  ││
│  │  Nome do perfil                  ││
│  │  [chip] [chip] [chip]            ││
│  └──────────────────────────────────┘│
│                                     │
│  ┌─ Mensagens ─────────────────────┐│
│  │  [IA]  Bolha verde esquerda     ││
│  │             Bolha âmbar direita ││
│  └──────────────────────────────────┘│
├─────────────────────────────────────┤
│  [Footer glass py-4]                │
│     max-w-2xl mx-auto               │
│  [input flex-1]  [Enviar]           │
└─────────────────────────────────────┘
```

### Header

- `h-14` fixo, `backdrop-filter: blur(16px)`, `background: rgba(7,15,9,0.8)`
- Botão "← Voltar": `text-sm`, hover muda para cor âmbar
- Perfil **centralizado** no header (via `absolute left-1/2 -translate-x-1/2`): emoji + nome em Playfair Display `text-sm font-semibold`
- Borda inferior: `border-b border-guarana/20`

### Estado vazio

- Centralizado verticalmente na área de mensagens
- Ícone do perfil: emoji em círculo `w-18 h-18`, fundo `rgba(45,106,79,0.4)`, sombra verde suave
- Nome do perfil: Playfair Display `text-xl text-areia`
- Subtítulo: `"Como posso te ajudar hoje?"`, Inter `text-sm opacity-60`
- 3 chips de sugestão clicáveis (hardcoded por profileId): botões `rounded-full border border-guarana/30 px-4 py-2 text-sm hover:border-guarana/70 transition`
- Ao clicar no chip: `inputText.value = chip.text` no `ChatView`

### ChatBubble

- **Mensagem usuário:** `justify-end`, `max-w-[75%]`, fundo `rgba(224,123,57,0.15)`, borda `rgba(224,123,57,0.35)`, border-radius `1.25rem 0.25rem 1.25rem 1.25rem`, `px-5 py-4`
- **Mensagem IA:** `justify-start`, `max-w-[90%] sm:max-w-[85%]`, sem borda, fundo `rgba(45,106,79,0.15)`, border-radius `0.25rem 1.25rem 1.25rem 1.25rem`, `px-5 py-4`
- Avatar do perfil (emoji, 28px) exibido à esquerda das mensagens da IA, alinhado ao topo da bolha
- Espaçamento entre mensagens: `mb-4`

### Footer / Input

- `backdrop-filter: blur(12px)`, `background: rgba(7,15,9,0.85)`, `border-top: 1px solid rgba(45,106,79,0.25)`
- Container `max-w-2xl mx-auto flex gap-3`
- Input: `min-h-[48px]`, `rounded-xl`, `px-4 py-3`, borda âmbar no foco, `background: rgba(45,106,79,0.12)`
- Botão: `rounded-xl px-6 py-3`, `background: #E07B39`, `box-shadow: 0 4px 15px rgba(224,123,57,0.3)`, hover `brightness(1.1)`

## Seção 4 — Tipografia e Markdown

### Carregamento das fontes

Carregados via `<link>` no `index.html` conforme Seção 1. Não alterar as variáveis `--font-family-*` no `main.css`.

### Tema prose no main.css

Após instalar `@tailwindcss/typography`, extender o tema prose com as cores do projeto:

```css
.prose {
  --tw-prose-body: rgba(244, 233, 216, 0.9);
  --tw-prose-headings: #F4E9D8;
  --tw-prose-strong: #E07B39;
  --tw-prose-code: #48CAE4;
  --tw-prose-bullets: rgba(224, 123, 57, 0.7);
  --tw-prose-hr: rgba(224, 123, 57, 0.2);
  --tw-prose-links: #48CAE4;
}
```

### StreamingText.vue

- Manter `prose prose-invert max-w-none` na div raiz
- Remover os estilos `:deep()` que hoje duplicam o que o plugin já fornece
- Manter apenas overrides específicos que o plugin não cobre (ex: `font-family: Playfair Display` nos headings)
- Manter cursor de streaming (blink) e lógica de `isStreaming`

## Critérios de sucesso

- [ ] Google Fonts carregam: Inter e Playfair Display visíveis no browser
- [ ] Markdown renderiza com hierarquia visual: headings em Playfair, `strong` em âmbar, listas com marcadores
- [ ] HomeView centralizada, com hero e grid responsivo (1/2/3 colunas)
- [ ] ChatView com estado vazio com chips, mensagens centralizadas, avatar da IA
- [ ] Mobile (375px): sem overflow horizontal, input acessível, cards full-width
- [ ] Desktop (1440px): conteúdo centrado com respiro lateral adequado
