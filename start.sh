#!/bin/bash

docker service create \
  --restart-condition=none \
  --detach=false \
  --name aurora \
  -e POSTGRES_URL=${POSTGRES_URL} \
  -e POSTGRES_REPLICAS=${POSTGRES_REPLICAS} \
  stevelacy/aurora-test node /code/index.js
