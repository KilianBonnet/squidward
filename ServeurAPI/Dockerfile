# Utilisez une image de base Node.js
FROM node

LABEL maintainer="Kilian Bonnet <kilian.bonnet1@etu.univ-cotedazur.fr>"
WORKDIR /app

COPY game ./game
COPY logic ./logic
COPY package*.json ./
COPY index.js ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]