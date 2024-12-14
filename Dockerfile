FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package.json files first
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Copy source code
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Install and build frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Install and build backend
WORKDIR /app/backend
RUN npm install
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]