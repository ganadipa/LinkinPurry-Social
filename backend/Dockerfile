FROM node:20-alpine

# Set the working directory
WORKDIR /app/backend

# Install dependencies
COPY package*.json ./

COPY prisma ./prisma
RUN npm install

# Copy source code and config
COPY . .

# TypeScript configuration
COPY tsconfig.json ./

# Source code will be mounted as a volume
EXPOSE 8000

CMD ["npm", "run", "dev"]