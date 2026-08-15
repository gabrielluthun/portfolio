# Portfolio CDA

Site portfolio en français (concepteur et développeur d'applications / full-stack).  
URL visée : [https://gabrielluthun.github.io/portfolio/](https://gabrielluthun.github.io/portfolio/)

## Stack

- Astro 7 + îles React
- TypeScript
- Tailwind CSS v4
- Lenis (smooth scroll)
- View Transitions Astro
- Données mockées (`src/data/projects.json`)
- Formulaire de contact : [Web3Forms](https://web3forms.com/)

Architecture N-tier : **présentation** (`src/pages`, `src/components`) → **services** (`src/services`) → **données** (`src/data/repositories`).

## Prérequis

- Node.js `>= 22.12.0`
- npm

## Installation

```bash
npm install
cp .env.example .env
```

Renseigner `PUBLIC_WEB3FORMS_ACCESS_KEY` dans `.env`. Ne jamais committer `.env`.

Le site n'a pas de backend : le quota / filtrage côté serveur vient de Web3Forms. Le formulaire ajoute un délai de 30 s entre deux envois dans le navigateur.

## Scripts

```bash
npm run dev      # http://localhost:4321/portfolio/
npm run build    # sortie statique dans dist/
npm run preview  # prévisualiser le build
```

Le `base` Astro est `/portfolio` : tous les liens internes passent par `import.meta.env.BASE_URL`.

## Déploiement (GitHub Pages)

1. Settings → Pages → **Source : GitHub Actions**.
2. Settings → Secrets and variables → Actions : créer le secret `PUBLIC_WEB3FORMS_ACCESS_KEY`.
3. Fusionner vers `main` (Gitflow) : seul un push sur `main` déclenche le workflow `.github/workflows/deploy.yml`.

Le thème clair est le défaut. Aucun rose n'est utilisé dans les styles.
