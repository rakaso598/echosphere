# EchoSphere Discord Bot Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
EXPOSE 8080
CMD ["yarn", "start"]
