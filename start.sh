#!/bin/bash

docker service create --restart-condition=none --detach=false --with-registry-auth --name aurora --secret env staeco/aurora-test sh -ac ". /run/secrets/env; node /code/index.js"
