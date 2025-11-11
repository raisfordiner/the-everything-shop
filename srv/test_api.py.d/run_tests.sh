#!/bin/bash

# Run API tests using Docker Compose
# Usage: ./run_tests.sh [config_file]
# Default config_file is config.json (for local backend)
# Use config.docker.json for docker backend

CONFIG_FILE=${1:-config.json}

echo "Running API tests with config: $CONFIG_FILE"

# Build and run the test service with config file as environment variable
docker-compose run --rm test python3 test_api.py $CONFIG_FILE

# Get the exit code
exit_code=$?

echo "Tests completed with exit code: $exit_code"
exit $exit_code
