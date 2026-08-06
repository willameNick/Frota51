# GiMusic 🎵

Player de música online, **legal e sem anúncios**, construído sobre a API pública do **Audius** (alternativa aberta ao Spotify, artistas independentes). PWA de arquivo único em HTML/JS/CSS vanilla, pronto pra Netlify.

> **Continuação no Claude Code:** este README é o ponto de partida. Todo o app está em `index.html` (não tem build). Abra a pasta no Code e peça o que quiser — os pontos de extensão estão mapeados no fim.

---

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | O app inteiro (HTML + CSS + JS num arquivo só). É só isso que roda. |
| `manifest.json` | Manifest do PWA (nome, cores, ícones, standalone). |
| `sw.js` | Service worker: cacheia a interface p/ abrir offline; **áudio e APIs sempre pela rede**. |
| `icon-192.png` `icon-512.png` `icon-maskable-512.png` | Ícones do PWA. |

## Deploy (Netlify)
Arraste a pasta inteira no Netlify (ou `netlify deploy`). O `index.html` é servido na raiz; o service worker e o manifest usam caminhos relativos (`./`), então funciona em qualquer subpasta. **Precisa ser HTTPS** pro service worker e pra instalação do PWA (a Netlify já dá HTTPS).

Testar local: `npx serve` ou `python3 -m http.server` na pasta (service worker precisa de origem, não abre por `file://`).

---

## APIs usadas (todas grátis, sem chave, com CORS liberado)

- **Audius** — catálogo, streaming e download. Sem API key: descobre um host em `https://api.audius.co` e chama com `?app_name=GiMusic`.
  - Trending: `/v1/tracks/trending?genre={genero}&limit=40`
  - Busca: `/v1/tracks/search?query={q}&limit=40`
  - Stream (progressivo, aceita `Range`): `/v1/tracks/{id}/stream` — o `<audio>` toca sem baixar tudo.
  - Download (só quando `is_downloadable`): `/v1/tracks/{id}/download` — devolve o arquivo com `content-disposition: attachment`.
  - Gêneros válidos: `Electronic, Rock, Metal, Alternative, Pop, Hip-Hop/Rap, R&B/Soul, Latin, Jazz...`
- **LRCLIB** (`lrclib.net`) — letras com sincronia (LRC) + texto puro. `/api/get` e `/api/search`.
- **Google Translate (gtx)** — `translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt` — traduz **e** detecta o idioma. Preserva quebras de linha (alinha original × PT). Fallback possível: MyMemory (`api.mymemory.translated.net`).

## Persistência (localStorage)
- `gi_favorites` — lista de faixas favoritadas.
- `gi_playlists` — playlists do usuário `[{id, name, tracks:[]}]`.

---

## Funcionalidades já prontas
- Streaming legal sem anúncio; player fixo com barra arrastável, buffer, prev/next, teclado (espaço/setas) e `mediaSession` (controles do sistema/fones).
- Abas: **Início** (trending), **Playlists**, **Buscar**, **Favoritos**.
- **Playlists por estilo** (curadas por gênero — `CURATED[]` no JS) e **playlists próprias** (criar, adicionar, remover faixa, excluir).
- **Favoritar/remover** (♥ de um toque + menu `⋯`).
- **Baixar no dispositivo** — só nas faixas que o artista liberou (`canDownload()`).
- **Painel de letra**: toque na música no player. Karaokê sincronizado; se for internacional, **tela dividida** original × português; imagem da banda desfocada no fundo (`cover_photo` do artista).
- PWA instalável (manifest + service worker + ícones).

## Estrutura do código (`index.html`, dentro do `<script>`)
- `state` — estado global (view, home, results, favorites, userPlaylists, queue, index...).
- `api()`, `streamUrl()`, `artwork()`, `artistBg()` — helpers do Audius.
- `renderTracks()` / `trackRow()` — renderização de listas; `state.currentList` é o que está na tela.
- Player: `playTracks()`, `loadCurrent()`, `togglePlay()`, `next()`, `prev()` + eventos do `<audio>`.
- Playlists: `CURATED[]`, `showPlaylists()`, `openCurated()`, `openUserPlaylist()`, sheet de ações (`openSheet()`).
- Letra: `getLyrics()` (LRCLIB), `parseLRC()`, `translateLines()` (gtx), `renderLyrics()`, `updateLyricHighlight()`.

## Ideias de próximos passos (candidatas p/ o Code)
1. **Modo Spotify** (opcional): aba separada com Web Playback SDK + login OAuth do usuário (Premium) — aí toca o catálogo licenciado real (System of a Down, Michael Jackson etc.) de forma legal. Conviveria com o Audius (aba "Grátis" × "Spotify").
2. **Fila editável** e reordenação (drag) + modo aleatório/repetir.
3. **Cache offline de faixas baixáveis** via Cache API (guardar o mp3/wav p/ tocar sem internet).
4. **Sincronizar tradução em karaokê** também no painel PT (hoje o original é o guia).
5. Trocar a tradução por uma API com chave (DeepL/Google oficial) se escalar.

---
Marca: **GiMusic** — "sua música, sem anúncios". Tema vermelho/preto (`--red:#e50914`, `--bg:#0a0a0a`).
