#!/bin/bash

docker build -t stevelacy/aurora-test .

docker push stevelacy/aurora-test
