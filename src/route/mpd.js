/**
 * mpd routes
 */
const mpc = require('../lib/mpd-client')

module.exports = async (fastify, options) => {
    const route = '/mpd'
    const { store } = fastify

    const client = await mpc.connect(options)

    fastify.register(require('fastify-websocket'))

    mpc.mpdState.on('change', () => {
        const msg = JSON.stringify(mpc.status)
        const { clients } = fastify.websocketServer
        clients.forEach(client => {
            client.send(msg)
        });
    })

    fastify.route({
        method: 'GET',
        url: route,
        schema: {
            description: 'get mpd status. also endpoint to websocket',
            tags: ['mpd']
        },
        handler: () => {
            return mpc.status
        },
        wsHandler: (conn, req) => {
            conn.socket.send(JSON.stringify(mpc.status))
            conn.socket.on('message', () => conn.socket.send(JSON.stringify(mpc.status)))
        }
    })

    /**
     * mpd-api common routes
     */
    fastify.route({
        method: ['GET', 'POST'],
        url: route + '/api/:section/:command',
        schema: {
            description: 'mpd api. For detailed Information see <https://github.com/cotko/mpd-api#api>',
            tags: ['mpd'],
            params: {
                type: 'object',
                required: ['section', 'command'],
                properties: {
                    section: {
                        type: 'string',
                        enum: Object.getOwnPropertyNames(client.api)
                    },
                    command: {
                        type: 'string'
                    }
                }
            },
            query: {
                type: 'object',
                properties: {
                    args: {
                        type: 'array',
                        items: {}
                    }
                }
            }
        },

        onRequest: (request, reply, done) => {
            const { args } = request.query
            if (typeof args === 'string') {
                try {
                    request.query.args = JSON.parse(args)
                }
                catch(e) { /* ignore */ }
            }
            done()
        },
        handler: async (req, rep) => {
            const { section, command } = req.params
            const { args } = req.query
            return  args ? await client.api[section][command](args) : await client.api[section][command]()
        }
    })

    fastify.route({
        method: 'GET',
        url: route + '/playpause',
        schema: {
            description: 'toggle play/pause',
            tags: ['mpd']
        },
        handler: async (req, rep) => {
            const { state } = mpc.status
            let command
            switch (state)
            {
                case 'play':
                    command = 'pause'
                    break
                case 'pause':
                    command = 'resume'
                    break
                default:
                    command = 'play'
            }
            return await client.api.playback[command]()
        }
    })

    fastify.route({
        method: 'GET',
        url: route + '/volume/:direction',
        schema: {
                description: 'easy to use volume up or down',
                tags: ['mpd'],
                params: {
                    type: 'object',
                    properties: {
                        direction: {
                            type: 'string',
                            enum: ['up', 'down']
                        }
                    }
                }
        },
        handler: async (req, rep) => {
            const {direction} = req.params
            const { volume } = mpc.status
            vol = direction === 'down' ? volume - 2 : volume + 2
            if (vol < 0) {
                vol = 0
            }
            else if(vol > 100) {
                vol = 100
            }
            if (vol === volume) {
                return vol
            }
            return await client.api.playback.setvol(vol)
        }
    })

    fastify.route({
        method: 'POST',
        url: route + '/replaceplay',
        schema: {
                description: 'replace queue with uri and play. data will store in list recent. only **uri** is required.',
                tags: ['mpd'],
                body: {
                    type: 'object',
                    required: ['uri'],
                    properties: {
                        uri: {
                            type: 'string'
                        },
                        name: {type: 'string'},
                        description: { type: 'string' },
                        logo: { type: 'string' },
                        custom: {type: 'object'}
                    }
                }
        },
        handler: async (req, rep) => {
            mpc.replaceplay(req.body.uri)
            store.add('recent', req.body)
            return req.body
        }
    })
}
