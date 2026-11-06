# DEGUSTE — Site de experiências & orçamentos

Site responsivo com a logo original da Deguste, catálogo de experiências, galeria filtrável,
formulário completo de solicitação de orçamento, resumo em tempo real, prévia da mensagem,
cópia de texto e botão de envio para WhatsApp (quando configurado).

Não requer React, Node, banco de dados, assinatura ou API para funcionar.

## 1. Ver o site

Abra `index.html` no navegador, ou publique a pasta em uma hospedagem de site estático
(ex.: GitHub Pages, Cloudflare Pages, Netlify).

> Para simular a hospedagem no computador, execute dentro da pasta:
>
> ```bash
> python -m http.server 8000
> ```
> e acesse `http://localhost:8000`.

## 2. Estrutura de Fotos e Vídeos Organizada

Todas as mídias foram devidamente organizadas em pastas temáticas dentro de `assets/`:

### Serviços Oficiais Deguste Drinks & Eventos
| Serviço | Identificador | Descrição |
| --- | --- | --- |
| **Bar de Drinks** | `bar-drinks` | Drinks clássicos, autorais e personalizados |
| **Crepe Francês** | `crepe-frances` | Crepes doces e salgados preparados na hora |
| **Massas ao Vivo (Macarrão)** | `massas-ao-vivo` | Massas com molhos especiais preparadas ao vivo |
| **Barca de Coco** | `barca-coco` | Recepção refrescante e cheia de estilo |
| **Barca de Shot** | `barca-shot` | Shots especiais para animar o seu evento |
| **Coffee Break** | `coffee-break` | Serviço completo com opções doces e salgadas |
| **Experiência Personalizada** | `personalizado` | Proposta sob medida para eventos especiais |

### Pastas organizadas por categoria (em `assets/fotos/`)
Todas as fotos foram renomeadas com nomes descritivos em português (sem códigos confusos do WhatsApp):
- `assets/fotos/` — Contém as fotos principais do site (`capa.jpg`, `mesa-de-drinks.jpg`, etc.) e todas as 91 fotos catalogadas no padrão `foto-01-noiva-brinde-barca-shots.jpg` a `foto-91-barca-coco-gramado-amarela-remo.jpg`.
- `assets/fotos/casamentos/` — 13 fotos organizadas (`01-noiva-brinde-barca-shots.jpg`, `13-casamento-israel-emily-gazebo-noite.jpg`, etc.).
- `assets/fotos/drinks-e-bar/` — 25 fotos organizadas (`01-banner-deguste-drinks-casal.jpg`, `08-moscow-mule-caneca-cobre-espuma.jpg`, etc.).
- `assets/fotos/mesas-e-gastronomia/` — 30 fotos organizadas (`02-mesa-favo-mel-frutas-cacau-aerea.jpg`, `19-banner-monte-seu-crepe.jpg`, etc.).
- `assets/fotos/barca-deguste/` — 18 fotos organizadas (`01-balcao-barca-shots-iluminados.jpg`, `14-barca-degust-entalhada-remo-cocos.jpg`, etc.).
- `assets/fotos/corporativo/` — 5 fotos organizadas (`01-coffee-break-corporativo-salao-amplo.jpg`, etc.).

### Vídeos e Reels (em `assets/videos/`)
Todos os 41 vídeos foram renomeados com slugs descritivos:
- Exemplos: `video-01-preparo-caipiroska-frutas.mp4`, `video-14-experiencia-favo-mel-ao-vivo.mp4`, `video-29-apresentacao-espaco-flamboyant.mp4`, `video-33-depoimento-dos-noivos.mp4`, `video-35-espuma-gengibre-moscow-mule.mp4`.
- `assets/videos/thumbs/` — Miniaturas correspondentes com o mesmo padrão (`thumb-01-preparo-caipiroska-frutas.jpg`, etc.).
- `assets/videos/videos.json` — Manifesto atualizado com os novos nomes, títulos, categorias e durações.
- Seção interativa **Deguste em Movimento** no site com player modal, filtros por tema e botão de expansão.

## 3. WhatsApp, Instagram e e-mail

Configurados em `js/config.js` com os dados oficiais da Deguste:

```js
window.DEGUSTE_CONFIG = {
  whatsapp: "5561981826209",
  instagram: "https://www.instagram.com/degusteventos_",
  email: "",
  regiao: "Brasília e região"
};
```

- **WhatsApp:** configurado com o número oficial `(61) 98182-6209`.
- **Ícone do WhatsApp:** todos os botões e chamadas para ação de orçamento agora utilizam o ícone SVG oficial do WhatsApp no lugar das setas diagonais.
- **Instagram:** configurado com `@degusteventos_`.
- **Envio direto:** ao preencher o formulário, o cliente pode clicar no botão dourado com ícone do WhatsApp para abrir a conversa no aplicativo/web com a mensagem pré-formatada.

## 4. Como funciona o pedido de orçamento

1. O visitante escolhe a ocasião, data (se souber), quantidade de convidados e local.
2. Seleciona um ou mais serviços, no catálogo ou no formulário.
3. Informa preferências, nome e telefone e confirma a autorização de contato.
4. Vê a prévia da mensagem preparada, pode copiá-la ou abrir o WhatsApp da empresa.

**Importante:** o site **não calcula valores** e não confirma disponibilidade.
A proposta é personalizada pela Deguste. O site não envia dados para um servidor;
os dados só saem do navegador quando o visitante envia/copiar a mensagem.

## 5. Alterar textos ou serviços

- Conteúdo do site e nomes dos arquivos de foto: `index.html`.
- Cores, responsividade e tipografia: `css/style.css`.
- Nomes internos dos serviços, resumo, validação e mensagem: `js/app.js`.
- Contatos: `js/config.js`.

Se você adicionar um novo serviço, mantenha o identificador igual em:
`data-add-service`, no `value` do checkbox e em `SERVICE_LABELS` do JavaScript.

## 6. Publicação simples

O arquivo inicial é `index.html`. É só enviar **todo o conteúdo** desta pasta
para sua hospedagem, preservando as subpastas `assets`, `css`, `js`.
Em Cloudflare Pages ou Netlify, pode publicar o repositório Git como site estático,
com diretório de saída igual à raiz e sem comando de build.

A URL, número e Instagram oficiais ainda precisam ser configurados pela empresa.

## 7. Observações

- A logo fornecida está em `assets/logo-deguste.png` (original) e
  `assets/logo-deguste.webp` (versão otimizada para o site).
- Formulário com validação básica, sem banco de dados, e-mail automático ou CRM.
- Recomenda-se HTTPS em produção; especialmente para cópia direta via clipboard.
- Não são exibidos depoimentos, preços, telefones ou áreas de atendimento inventados.
