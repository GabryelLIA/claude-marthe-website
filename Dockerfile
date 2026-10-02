# Construction
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Exécution : Nitro est autonome, seul .output est nécessaire
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/.output .output
ENV PORT=3000 NODE_ENV=production
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
