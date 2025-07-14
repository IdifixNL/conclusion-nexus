#!/bin/bash

# Create the persistent network if it doesn't exist
docker network create sharednet 2>/dev/null || echo "Network sharednet already exists"

# Start the services
docker-compose up -d

echo "Services started on sharednet network" 