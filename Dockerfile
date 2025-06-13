# Build stage
FROM node:20-alpine as build-stage

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy built files from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY purchase_record_web_app_cert.pem /etc/ssl/certs/cert.pem
COPY purchase_record_web_app_key.pem /etc/ssl/private/key.pem

# Expose port 80
EXPOSE 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 