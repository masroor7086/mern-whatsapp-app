FROM node:18

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Expose port
EXPOSE 5001

# Run with nodemon (development)
CMD ["npx", "nodemon", "src/index.js"]
