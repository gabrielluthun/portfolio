# Plan de tests

## Périmètre

| Couche | Outil | Oui | Non |
| --- | --- | --- | --- |
| Unitaire | Vitest | Validation contact, honeypot, cooldown, projets phares, URLs d’aperçu | Composants de présentation purs |
| Intégration | Vitest + `fetch` mocké | Repository contact (clé, HTTP, JSON), `submitContact` → POST, lecture JSON projets | Appel réel à Web3Forms |
| E2E | Playwright (Chromium) | Accueil, catalogue, fiches, 404, formulaire (succès intercepté) | Envoi d’e-mail réel, paiement, auth |

## Cas unitaires

1. Contact — nom / e-mail / sujet / message trop courts ou trop longs.
2. Contact — e-mail invalide ; consentement absent ; champs valides après trim.
3. Contact — `botcheck: true` → succès, pas d’appel repository.
4. Contact — second envoi avant 30 s → message de cooldown.
5. Projets — `getFeaturedProjects` respecte `featured` et la limite.
6. Aperçu — URL `http(s)` inchangée ; chemin relatif préfixé par `base`.
7. `sitePath` — jointure `/portfolio` + `projets` sans coller les segments.

## Cas d’intégration

1. Repository — clé absente → `MISSING_KEY`, pas de `fetch`.
2. Repository — HTTP 200 + `success: true` → `ok`.
3. Repository — HTTP 200 + `success: false` ou HTTP 500 → `REMOTE`.
4. Repository — `fetch` jette → `NETWORK`.
5. Service + repository — payload valide → POST vers Web3Forms avec `access_key` et champs.
6. JSON projets — `findAllProjects` / `findProjectById` (id connu / inconnu).

## Cas E2E

1. Accueil : titre, lien vers `/projets`.
2. Catalogue : 3 cartes ; ouverture de MaxTracker.
3. Fiche MaxTracker : lien démo. Fiche Geekment : pas de « Voir la démo ».
4. 404 : page française.
5. Contact : champs valides + case RGPD ; POST Web3Forms intercepté ; message de succès.

## Exécution

```bash
npm test          # unitaires + intégration
npm run test:e2e  # Playwright (build + preview)
```

CI : `.github/workflows/test.yml` sur `develop`, `main` et les pull requests.

Critère de passage : 100 % des cas ci-dessus verts. Un E2E qui touche le réseau Web3Forms est un échec (l’interception doit rester en place).
