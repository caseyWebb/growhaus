FROM node:lts-alpine as builder
WORKDIR /tmp
RUN yarn add @caseywebb/growhaus-web@canary

FROM nginx:alpine as web
COPY --from=builder /tmp/node_modules/@caseywebb/growhaus-web/dist /usr/share/nginx/html