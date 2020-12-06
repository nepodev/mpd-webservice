# mpd webservice

mpd webservice API.


## Install

```sh
git clone https://github.com/nepodev/mpd-webservice
cd mpd-webservice
yarn --prod

## create config.json if need

node src/

```

## API

Endpoints documentation via swagger.

<http://localhost:3000/doc>

## config.json

```json
{
    "server": {
        "host": "localhost",
        "port": 3000 
    },
    "fastify": {
        "logger": true
    },
    "mpd": {
        "host": "localhost",
        "port": 6600
    },
    "cors": {
        "origin": true
    },
    "store": {
        "file": "store.json",
        "max_recent": 50,
        "max_favorites": 0
    }
}
```

| Section | Description |
| ------- | ----------- |
| **server** | Fastify Service options. See <https://www.fastify.io/docs/latest/Server/#listen> |
| **fastify** | fastify Options. Ifneed take a look at <https://www.fastify.io/docs/latest/Server/#initialconfig> |
| **mpd** | location of mpd service. See <https://github.com/cotko/mpd-api#usage> |
| **cors** | CORS Options. See <https://github.com/fastify/fastify-cors#options> |
| **store** | store for recent and favorites. |
