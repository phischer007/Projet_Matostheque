FROM node:24.16.0-alpine3.23

RUN npm install -g npm@latest

RUN mkdir -p /app/ && chown -R node:node /app/

WORKDIR /app/

USER node

COPY --chown=node:node package.json package-lock.json* ./

RUN npm install

RUN npm install dotenv --save

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3030

CMD ["npm", "run", "start"]