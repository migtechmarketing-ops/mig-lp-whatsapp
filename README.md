# MIG — Landing pages (LP WhatsApp)

Landing page de captação da MIG ("Sua jornada de imigração profissional para os EUA começa com estratégia"),
replicada em 31 versões — uma por parceiro, mentor ou canal de tráfego. As páginas são idênticas entre si;
muda apenas o `data-form-id` do formulário HubSpot.

## Stack

React 18 + TypeScript + Vite + Tailwind CSS. Fonte Namian, vídeo de fundo próprio, formulário HubSpot embedado.

## Rodando localmente

```bash
npm install
npm run dev
```

## Estrutura

- `src/components/Hero.tsx` — página 1: vídeo de fundo, título, subtítulo e o card do formulário.
- `src/components/FinalCTA.tsx` — página 2: CTA final; o botão rola até o formulário da página 1.
- `index.html` — contém o container `.hs-form-frame` do HubSpot. Ele precisa existir no HTML inicial:
  o script do HubSpot varre o DOM apenas no load, então o container não pode ser criado pelo React.
  O componente move o formulário já renderizado para dentro do layout.
- `partners.json` — lista de slugs e respectivos `form-id` do HubSpot.
- `deploy-all.mjs` — gera uma cópia do build por parceiro (trocando o `form-id`) e publica cada uma
  como um projeto Vercel próprio.
- `deploy-urls.txt` — resultado do último deploy: slug, form-id e URL de cada LP.

## Publicando todas as LPs

```bash
npm run build
node deploy-all.mjs
```

Para publicar apenas algumas, passe os slugs: `node deploy-all.mjs faipe linkedin`.

Cada LP é publicada em `https://mig-lp-<slug>.vercel.app`, no time `mig-tech` da Vercel.
