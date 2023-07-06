FROM ghcr.io/puppeteer/puppeteer:20.0.0

ENV PUPPETEER_SKIP_CHROMIUM=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD npm run start
