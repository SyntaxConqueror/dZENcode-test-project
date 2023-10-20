FROM node:16.15.1-alpine

WORKDIR /app
COPY ./frontend/package.json .

RUN npm install
COPY ./frontend .

CMD ["npm", "run", "dev"]