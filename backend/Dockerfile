FROM node:20

# Create app directory and set permissions
WORKDIR /app/backend

# Copy package files first to leverage Docker cache
COPY package*.json ./

COPY prisma ./prisma
# Install dependencies with full logs for debugging
RUN npm ci --verbose

# Copy .env.example to .env
COPY .env.example .env

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Set environment and permissions
ENV PORT=3000
ENV NODE_ENV=production

# Switch to non-root user
USER node

EXPOSE 3000

# Modify the start command to get more debugging info
CMD ["node", "--trace-warnings", "--unhandled-rejections=strict", "dist/index.js"]
