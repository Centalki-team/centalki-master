FROM node:18 AS development
WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn
COPY . .
RUN yarn build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/dist ./dist
COPY --from=development /app/service-account-file.json ./service-account-file.json

CMD ["node", "dist/main"]