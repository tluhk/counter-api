FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies using npm install instead of npm ci
# Add morgan for logging
RUN npm install --omit=dev morgan

# Copy application code
COPY . .

# Add logging configuration
RUN if [ -f src/app.js ]; then \
      sed -i '/const app = express()/a \\\n// Request logging\nconst morgan = require("morgan");\napp.use(morgan("[:date[iso]] :method :url :status :res[content-length] - :response-time ms"));\n' src/app.js; \
    elif [ -f src/index.js ]; then \
      sed -i '/const app = express()/a \\\n// Request logging\nconst morgan = require("morgan");\napp.use(morgan("[:date[iso]] :method :url :status :res[content-length] - :response-time ms"));\n' src/index.js; \
    fi

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "src/index.js"]
