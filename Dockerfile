FROM node:20.15-bullseye-slim

WORKDIR /app

COPY . .

RUN rm -rf node_modules
RUN npm ci
RUN npx prisma generate

EXPOSE ${PORT}