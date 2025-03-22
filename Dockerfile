FROM node:16-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json ./
# If package-lock.json exists, copy it too (preferred)
COPY package-lock.json* ./

# Use npm install with --omit=dev instead of npm ci
RUN npm install --omit=dev

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "index.js"]
