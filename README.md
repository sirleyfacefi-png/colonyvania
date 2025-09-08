# Colonyvania – Estrutura Inicial (Phaser 3)
Projeto modularizado para continuar o MVP no navegador.

## Rodando localmente
1) Descompacte.
2) Sirva via HTTP (ex.: `python -m http.server 8000`) e abra `http://localhost:8000/`.
3) Controles: P1 (WASD + F), P2 (Setas + /), R reinicia.

## Estrutura
- `index.html` — carrega Phaser (global) e `src/main.js` (ES modules).
  - `src/assets/` — sprites e outros assets (ex.: `red-dot.png`).
- `src/config.js` — constantes (tamanho, velocidades, física).
- `src/main.js` — configura e inicia o jogo.
- `src/scenes/BootScene.js` — preloading e geração de texturas/sprites dos personagens.
- `src/scenes/GameScene.js` — mapa, câmera, colisões, HUD.
- `src/objects/Player.js` — personagem com movimento polido (coyote time, double jump, squash).
- `src/objects/Enemy.js` — inimigo simples com patrulha.
- `src/ui/HUD.js` — HUD em DOM.

## Sobre colaboração
Eu não consigo acessar seu GitHub nem trabalhar “em background”. Mas posso:
- Gerar arquivos/patches aqui (zips ou diffs) para você subir.
- Rever trechos que você colar e sugerir melhorias.
- Ajudar a configurar uma estrutura de pastas, scripts de build e hospedagem.

## Próximos passos sugeridos
- Adicionar **checkpoint/saída** e mini-objetivo (coletar 3 itens).
- Separar input por device e permitir rebind.
- Criar **Tilemap** (Tiled) para desenhar fases ao invés de plataformas hardcoded.
- Preparar netcode (Colyseus/Nakama) quando o single estiver redondo.

## Dev com Vite (opcional)
1) `npm i`
2) `npm run dev`
3) abre automaticamente em `http://localhost:5173/`
