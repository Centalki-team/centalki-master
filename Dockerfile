FROM node:18 AS builder
WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn
COPY . .
RUN yarn build


FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/service-account-file.json ./service-account-file.json

CMD ["node", "dist/main"]