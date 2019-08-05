FROM node:lts-alpine as builder
WORKDIR /app
RUN yarn add @caseywebb/growhaus-web

FROM nginx:alpine as web
COPY --from=builder /app /usr/share/nginx/html