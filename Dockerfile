# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for better caching
COPY package.json ./
RUN npm install

# Copy source files
COPY client/ ./client/
COPY shared/ ./shared/
COPY vite.config.ts ./
COPY tsconfig.json ./

# Build the frontend
RUN npm run build

# Final Stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy build artifacts and server code
COPY --from=builder /app/dist ./dist
COPY server.cjs ./
COPY ecosystem.config.cjs ./

# Copy static content/media
COPY CSR/ ./CSR/
COPY Certifications/ ./Certifications/
COPY attached_assets/ ./attached_assets/
COPY uploads/ ./uploads/

# Expose the app port
EXPOSE 5100

# Set environment to production
ENV NODE_ENV=production

# Run the server
CMD ["node", "server.cjs"]
