# Gunakan Node.js LTS (18)
FROM node:18

# Set working directory
WORKDIR /app

# Install NestJS CLI secara global
RUN npm install -g @nestjs/cli

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production --legacy-peer-deps

# Salin seluruh file proyek
COPY . .

# Build NestJS
RUN npm run build

# Expose port NestJS (default 3000)
EXPOSE 3000

# Jalankan aplikasi dalam mode production
CMD ["npm", "run", "start:prod"]
