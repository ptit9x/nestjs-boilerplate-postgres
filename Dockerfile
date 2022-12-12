FROM node:16.18.1-alpine3.15

COPY package.json package-lock.json /app/
WORKDIR /app
RUN ["npm", "install"]
COPY . /app/
RUN ["npm", "run", "build"]
CMD ["npm", "run", "start:prod"]