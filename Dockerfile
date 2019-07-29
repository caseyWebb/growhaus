FROM node:lts-alpine as builder
WORKDIR /repo
ENV NODE_ENV production
ENV SERVER_URL ws://apps.caseywebb.xyz/growhaus/api
ENV WEB_UI_URL https://apps.caseywebb.xyz/growhaus
RUN apk add git python2
COPY support ./support
COPY lerna.json package.json yarn.lock ./
COPY agent/package.json agent/package.json
COPY lib/package.json lib/package.json
COPY server/package.json server/package.json
COPY web/package.json web/package.json
RUN yarn install --pure-lockfile
COPY agent/src ./agent/src
COPY agent/tsconfig.json ./agent
COPY lib/src ./lib/src
COPY lib/tsconfig.json ./lib
COPY server/src ./server/src
COPY server/tsconfig.json ./server
COPY web/@types ./web/@types
COPY web/src ./web/src
COPY web/tsconfig.json web/webpack.config.js ./web/
RUN yarn build
RUN support/nohoist.js
RUN yarn install --production --pure-lockfile

FROM node:lts-alpine as server
WORKDIR /repo
COPY --from=builder /repo/server/dist ./
COPY --from=builder /repo/server/node_modules ./node_modules

FROM nginx:alpine as web
COPY --from=builder /repo/web/dist /usr/share/nginx/html