# Turn Vue app into Docker container

## Sur cette machine — construire l'image (sans la lancer)

```sh
./scripts/docker.sh          # → image locale : claude-marthe
```

## Sur le VPS — lancer

```sh
# ici : envoyer le projet
scp -r . <vps>:claude-marthe       # ou git clone

# sur le VPS :
cd claude-marthe && docker build -t claude-marthe .
docker run -d --name claude-marthe --restart unless-stopped -p 80:3000 claude-marthe
```

Site up sur le port 80. `--restart unless-stopped` le relance après reboot du VPS.

## Ce qu'il faut savoir

- Build multi-stage `node:22-alpine` : `npm run build` régénère dans le conteneur
  le JSON (CSV → JSON), les variantes d'images (sharp) et le logo.
- L'exécution ne copie que `.output` : le bundle Nitro est autonome, sans `node_modules`.
- Seuls le code, `ClaudeMartheDetailsSite.csv`, `images/` et `logos/` sont requis
  dans le contexte Docker (le reste est exclu par `.dockerignore`).
