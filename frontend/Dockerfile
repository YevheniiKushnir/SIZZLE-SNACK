FROM node:lts-buster AS development

WORKDIR /frontend

COPY package.json /frontend
COPY package-lock.json /frontend

RUN npm i

COPY . /frontend