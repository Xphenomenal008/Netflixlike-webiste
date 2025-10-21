# ---------- FRONTEND BUILD ----------
    FROM node:18 AS frontend
    WORKDIR /app
    COPY ./frontend ./frontend
    WORKDIR /app/frontend
    RUN npm install
    RUN npm run build
    
    # ---------- BACKEND SETUP ----------
    FROM node:18 AS backend
    WORKDIR /app
    
    # Copy backend code
    COPY ./backend ./backend
    COPY ./backend/package*.json ./
    RUN npm install
    
    # Copy built frontend from previous stage into backend
    COPY --from=frontend /app/frontend/dist ./frontend/dist
    
    EXPOSE 5000
    CMD ["node", "backend/server.js"]
    