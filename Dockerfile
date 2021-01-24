FROM node:14-alpine

COPY . .

RUN  npm install --loglevel silly

EXPOSE 8100 35729 53703

ENTRYPOINT [ "npm",  "run", "start" ]

CMD [ "--address", "0.0.0.0", "--verbose" ]