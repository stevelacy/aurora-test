FROM node:8.9

RUN mkdir -p /code
WORKDIR /code

copy . /code
