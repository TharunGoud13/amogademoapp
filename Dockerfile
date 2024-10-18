# Dockerfile
FROM node:20.15.0-alpine as builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Next.js app
RUN npm run build

# Production image
FROM node:20.15.0-alpine

# Set working directory
WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/ ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
