#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push susan323/udacity-restapi-user
docker push susan323/udacity-restapi-feed
docker push susan323/reverseproxy
docker push susan323/udacity-frontend