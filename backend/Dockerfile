# Use official Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port
EXPOSE 5001

# Start the app using node (not nodemon in Docker)
CMD ["node", "src/index.js"]
