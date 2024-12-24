# Stage 1: Build the Angular app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Set environment variables
ARG API_URL "http://localhost/api"
ENV NG_APP_API_URL ${API_URL}

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app
RUN npm run build --configuration=production

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine

# Copy the built app to Nginx's default public directory
# COPY --from=build /app/dist/frontend /usr/share/nginx/html
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

RUN chmod -R 755 /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf



# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]