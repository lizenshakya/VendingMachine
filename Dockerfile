FROM node:14-alpine

WORKDIR /app
COPY package.json .

ARG NODE_ENV

RUN npm i

COPY . .
ENV PORT 5000
EXPOSE $PORT
# CMD ["npm", "run", "dev"]
CMD ["node", "index.js"]