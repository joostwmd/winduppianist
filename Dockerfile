FROM node:19

RUN apt update


WORKDIR /opt/app/client


COPY ./client/package*.json /opt/app/client/
RUN npm i


COPY ./client/public /opt/app/client/public/
COPY ./client/src /opt/app/client/src/

RUN npm run build

WORKDIR /opt/app


COPY ./.env /opt/app/
COPY ./package*.json /opt/app/

RUN npm i
RUN npm i rpi-ws281x-native
RUN npm i node-cmd

COPY ./config /opt/app/config/
COPY ./routes /opt/app/routes/


COPY ./server.js /opt/app/
COPY ./app.js /opt/app/
COPY ./start_light_sequence.py /opt/app/


CMD ["node", "./server.js"]