#!/bin/bash

# Save the current value of DATABASE_CONTAINER
OLD_DB_CONTAINER=$(grep "^DATABASE_CONTAINER=" .env | cut -d= -f2)

# Replace the value of DATABASE_CONTAINER with "localhost"
sed -i '' -e 's/^DATABASE_CONTAINER=.*/DATABASE_CONTAINER=localhost/' .env

# Run script here
eval "$@"

# Replace "localhost" with the original value of DATABASE_CONTAINER
sed -i '' -e "s/^DATABASE_CONTAINER=.*/DATABASE_CONTAINER=${OLD_DB_CONTAINER}/" .env
