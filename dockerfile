FROM node:18 AS Client
WORKDIR /app
COPY . .
RUN npm run build
EXPOSE  5000
CMD [ "npm","start" ]
