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
    },
    "station": {
        "language": "en"
    }
}
```

| Section | Description |
| ------- | ----------- |
| **server** | Fastify Service options. See <https://www.fastify.io/docs/latest/Server/#listen> |
| **fastify** | Fastify options. If needed take a look at <https://www.fastify.io/docs/latest/Server/#initialconfig> |
| **mpd** | Location of mpd service. host, port, password or path if socket is using. See <https://github.com/cotko/mpd-api#usage> |
| **cors** | CORS Options. See <https://github.com/fastify/fastify-cors#options> |
| **store** | store for recent and favorites. |
| **station** | language for stations. Avaliable: en, de, at, fr, es, pt, it, pl, dk, se |
