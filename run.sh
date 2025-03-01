#!/bin/bash

# Default values
API_PORT=${API_PORT:-3000}
CONTAINER_PORT=${CONTAINER_PORT:-3000}

# Display current configuration
echo "Starting Counter API with the following configuration:"
echo "API_PORT (host): $API_PORT"
echo "CONTAINER_PORT (internal): $CONTAINER_PORT"

# Export variables for docker-compose
export API_PORT
export CONTAINER_PORT

# Run docker-compose
docker-compose up -d

echo "Counter API is running at http://localhost:$API_PORT"
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
