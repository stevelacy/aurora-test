#!/bin/bash

docker build -t staeco/aurora-test .

docker push staeco/aurora-test
