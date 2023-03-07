FROM node:lts-alpine as builder

WORKDIR /app

ADD . ./
RUN rm -rf node_modules
RUN yarn install --frozen-lockfile --immutable --immutable-cache --check-cache
RUN yarn cache clean --all
RUN yarn build

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/.output ./.output

ENV HOST=0.0.0.0
ENV NUXT_PORT=$PORT

ENTRYPOINT ["node", ".output/server/index.mjs"]
