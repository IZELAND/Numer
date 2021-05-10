FROM node:14.16.1-alpine3.10
RUN npm install
RUN mkdir /root/data
COPY pj /root/data