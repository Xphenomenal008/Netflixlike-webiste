FROM node:18 AS Client
WORKDIR /app
COPY backend/ .
COPY frontend/ ../frontend
RUN npm run build
EXPOSE  5000
CMD [ "npm","start" ]
