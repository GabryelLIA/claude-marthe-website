#!/usr/bin/env sh
# Construit l'image Docker (sans la lancer : le run se fait sur le VPS).
# Usage : scripts/docker.sh
set -e
cd "$(dirname "$0")/.."

docker build -t claude-marthe .
