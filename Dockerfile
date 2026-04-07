# Build React frontend
FROM node:20-alpine AS client-build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --legacy-peer-deps
COPY client/ ./
RUN npm run build

# Build backend
FROM node:20-alpine

WORKDIR /app

# Copy built frontend
COPY --from=client-build /app/client/build ./client/build

# Copy server
COPY server/ ./server/
WORKDIR /app/server

# Install server dependencies
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
