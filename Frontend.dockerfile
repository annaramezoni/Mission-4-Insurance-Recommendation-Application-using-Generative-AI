# Stage 1: build the app with Node
FROM node:26-alpine AS build
WORKDIR /app
COPY M4-frontend/package*.json ./
RUN npm ci
COPY M4-frontend/ ./
RUN npm run build

# Stage 2: serve the built files with nginx
FROM nginx:alpine
# Vite builds to dist/ (Create React App: build/)
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

