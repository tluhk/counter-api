# Visit Counter API

A simple API for counting visits to websites and GitHub repositories.

## Setup

### Standard Setup
1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in `.env` file:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/visit-counter
   ALLOWED_ORIGINS=https://github.com,http://yourwebsite.com,http://localhost:3000,http://192.168.*.*
   ```
4. Start the server:
   ```
   npm start
   ```

### Docker Setup (Recommended)
1. Clone this repository
2. Make sure Docker and Docker Compose are installed on your server
3. Configure environment variables:
   ```
   # Create a .env file or export these variables in your shell
   API_PORT=3000        # The port exposed on your host machine
   CONTAINER_PORT=3000  # The port used inside the container
   ALLOWED_ORIGINS=https://github.com,http://yourwebsite.com,http://192.168.*.*
   ```
4. Run the application:
   ```
   docker-compose up -d
   ```
   This will start both the API and MongoDB in containers.
5. To use a different port (e.g., port 8080):
   ```
   API_PORT=8080 docker-compose up -d
   ```
6. To stop the application:
   ```
   docker-compose down
   ```
7. To view logs:
   ```
   docker-compose logs -f
   ```

## CORS Configuration

This API supports wildcards in the ALLOWED_ORIGINS environment variable to allow access from local networks:

```
ALLOWED_ORIGINS=https://github.com,http://localhost:3000,http://192.168.*.*,http://10.*.*.*
```

Common local network patterns:
- `http://localhost:*` - All localhost ports
- `http://192.168.*.*` - Home/small office networks
- `http://10.*.*.*` - Private networks
- `http://172.16.*.*-http://172.31.*.*` - Private networks

## API Endpoints

- `GET /api/counter/hit/:key` - Increment counter for a specific key and get current count
- `GET /api/counter/:key` - Get current count without incrementing
- `GET /api/badge/:key` - Get SVG badge with visit count (increments the counter)
- `GET /api/badge/view/:key` - Get SVG badge without incrementing the counter

### Health Check Endpoints

- `GET /health` - Detailed health status with MongoDB connection state and system metrics
- `GET /ping` - Simple health check that returns "pong" (useful for load balancers)

## Badge Customization

You can customize the badge appearance with query parameters:

- `label` - Text for the left part of the badge (default: "visitors")
- `color` - Color for the right part (hex without #, default: "4c1")
- `labelColor` - Color for the left part (hex without #, default: "555")
- `style` - Badge style: "flat" (default), "flat-square", "plastic", or "for-the-badge"

Example:
```
https://your-counter-api.com/api/badge/username-repo?label=views&color=blue&style=for-the-badge
```

## Usage Examples

### For Websites

Add this script to your HTML page:

```html
<script>
  fetch('https://your-counter-api.com/api/counter/hit/mywebsite')
    .then(response => response.json())
    .then(data => {
      document.getElementById('visitor-count').textContent = data.count;
    });
</script>
<p>Visitor count: <span id="visitor-count">0</span></p>
```

### For Local Network Usage

If you're using this on a local network, use your server's IP address:

```html
<script>
  fetch('http://192.168.1.100:3000/api/counter/hit/local-app')
    .then(response => response.json())
    .then(data => {
      document.getElementById('visitor-count').textContent = data.count;
    });
</script>
```

### For GitHub Repositories

Add this to your GitHub README.md:

```markdown
![Visitors](https://your-counter-api.com/api/badge/username-repo)
```

Alternatively, use the following markdown for a non-incrementing badge:

```markdown
![Visitors](https://your-counter-api.com/api/badge/view/username-repo)
```

For a shields.io style badge:

```markdown
![Visitors](https://img.shields.io/badge/dynamic/json?color=brightgreen&label=Visitors&query=count&url=https://your-counter-api.com/api/counter/username-repo)
```

## Production Deployment

For production deployment:

1. Clone the repository to your server
2. Configure the ports and environment variables in the `.env` file:
   ```
   API_PORT=80          # Use port 80 for HTTP (or 443 for HTTPS)
   CONTAINER_PORT=3000  # Keep the internal port as 3000
   ALLOWED_ORIGINS=https://yourdomain.com,https://github.com
   ```
3. If needed, configure MongoDB authentication by uncommenting the environment variables in docker-compose.yml
4. For HTTPS, it's recommended to use a reverse proxy like Nginx in front of this application
5. Run `docker-compose up -d` to start the service