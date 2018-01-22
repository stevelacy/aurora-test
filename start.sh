#!/bin/bash

docker service create --restart-condition=none --detach=false --with-registry-auth --name aurora --secret env -e staeco/aurora-test sh -ac ". /run/secrets/env; node /code/index.js"
