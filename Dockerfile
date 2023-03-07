FROM node:lts-alpine as builder

WORKDIR /app

ADD . ./
RUN rm -rf node_modules
RUN yarn install --frozen-lockfile --immutable --immutable-cache --check-cache
RUN yarn build

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/.nuxt ./.nuxt

ENV HOST=0.0.0.0
ENV NUXT_PORT=$PORT
ENV NODE_ENV=production

ENTRYPOINT ["node", ".output/server/index.mjs"]
