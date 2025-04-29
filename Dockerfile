FROM node:18 AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:18 AS backend
WORKDIR /app
COPY backend ./backend
COPY --from=build-frontend /app/frontend/build ./frontend-build
WORKDIR /app/backend
RUN npm install
COPY --from=build-frontend /app/frontend/build ../frontend-build

ENV PORT=3001
CMD ["node", "index.js"]