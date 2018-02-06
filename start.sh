#!/bin/bash

docker run \
  --name aurora \
  -e POSTGRES_URL=${POSTGRES_URL} \
  -e POSTGRES_REPLICAS=${POSTGRES_REPLICAS} \
  stevelacy/aurora-test node /code/index.js
