FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies using npm install instead of npm ci
RUN npm install --omit=dev

# Copy application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "src/index.js"]
