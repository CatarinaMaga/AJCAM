# AJCAM Linyx — Argos EPI

Site institucional da equipe AJCAM Linyx (SENAI Lauro de Freitas/BA) e do Argos EPI, sistema de monitoramento do uso de equipamentos de proteção individual com visão computacional.

- Site: https://ajcam.vercel.app
- Sistema Argos EPI: https://argosepi.vercel.app

## Estrutura

Site estático, sem etapa de build:

- `index.html`: conteúdo das seções (Sobre, Histórico, Demonstração, Equipe e Contato)
- `styles.css`: visual, com a mesma paleta e as mesmas fontes (Anton e Outfit) do Argos EPI
- `app.js`: menu do celular, abas da demonstração e simulação de alerta
- `assets/`: logotipo, imagens, fotos da equipe e vídeo do pitch

## Ver localmente

```bash
python -m http.server 5180
```

Depois abra http://localhost:5180 no navegador.
