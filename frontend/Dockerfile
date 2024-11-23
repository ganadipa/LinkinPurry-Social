FROM node:20-alpine

# Set the working directory
WORKDIR /app/frontend

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and config
COPY . .

# Source code will be mounted as a volume
EXPOSE 5173

CMD ["npm", "run", "dev"]