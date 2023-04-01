# FROM python:3 as build

# WORKDIR /opt/app
# RUN python -m venv /opt/app/venv
# ENV PATH="/opt/app/venv/bin:$PATH"

# RUN pip3 install rpi_ws281x adafruit-circuitpython-neopixel 
# RUN pip3 install pip install --force-reinstall adafruit-blinka



FROM node:19

RUN apt update
#RUN apt install -y software-properties-common
#RUN apt install -y python3

WORKDIR /opt/app/client
#COPY --from=build /opt/app/venv /venv

COPY ./client/package*.json /opt/app/client/
RUN npm i


COPY ./client/public /opt/app/client/public/
COPY ./client/src /opt/app/client/src/

RUN npm run build

WORKDIR /opt/app
#COPY --from=build /opt/app/venv /opt/app/venv

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
#COPY ./npm-package-test.js /opt/app/

CMD ["node", "./server.js"]