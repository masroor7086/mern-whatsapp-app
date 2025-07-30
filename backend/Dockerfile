# Use official Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Accept environment variables as build arguments
ARG MONGODB_URI
ARG JWT_SECRET
ARG CLOUDINARY_CLOUD_NAME
ARG CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET
ARG NODE_ENV
ARG PORT

# Set environment variables in container (build-time to runtime)
ENV MONGODB_URI=$MONGODB_URI \
    JWT_SECRET=$JWT_SECRET \
    CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME \
    CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY \
    CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET \
    NODE_ENV=$NODE_ENV \
    PORT=$PORT

# Expose backend port
EXPOSE 5001

# Start the app
CMD ["node", "src/index.js"]
