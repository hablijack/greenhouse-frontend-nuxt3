FROM node:lts-alpine as builder

RUN mkdir -p /app
WORKDIR /app

COPY . .
RUN yarn install
RUN yarn build

FROM node:lts-alpine

COPY --from=builder /app/.output /app/.output

#ENV HOST=0.0.0.0
#ENV PORT=$PORT
#ENV NODE_ENV=production

ENTRYPOINT ["node", "/app/.output/server/index.mjs"]
