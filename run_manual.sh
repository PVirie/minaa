#!/bin/bash

docker compose -f docker/docker_compose.yaml down
docker compose -f docker/docker_compose.yaml --profile gpu up -d --build --force-recreate