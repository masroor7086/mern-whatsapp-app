# Stage 1: Build
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Accept build-time env vars for Vite
ARG VITE_BACKEND_URL

# Vite will pick up any variable that starts with VITE_
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Build your frontend
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy build output to NGINX folder
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
