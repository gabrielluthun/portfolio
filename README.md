# Portfolio

## Stack

- **Astro 7** + React Islands
- **TypeScript**
- **Tailwind CSS** v4
- **Lenis** (smooth scroll)
- **View Transitions** Astro
- Formulaire de contact : [Web3Forms](https://web3forms.com/)

Architecture n-tiers : **présentation** (`src/pages`, `src/components`) → **services** (`src/services`) → **données** (`src/data/repositories`).

## Prérequis

- Node.js `>= 22.12.0`
- npm

## Installation

```bash
npm install
cp .env.example .env
```

Renseigner `PUBLIC_WEB3FORMS_ACCESS_KEY` dans `.env`.

## Scripts

```bash
npm run dev      # http://localhost:4321/portfolio/
npm run build    # sortie statique dans dist/
npm run preview  # prévisualiser le build
npm test         # unitaires + intégration (Vitest)
npm run test:e2e # parcours navigateur (Playwright)
```

Plan de tests : [`tests/plan.md`](tests/plan.md).
