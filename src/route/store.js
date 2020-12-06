
module.exports = async (fastify, options) => {
    const route = '/store'
    const { store } = fastify

    fastify.route({
        method: 'GET',
        url: route + '/:listname',
        schema: {
            description: 'Get list recent or favorites',
            tags: ['store'],
            params: {
                type: 'object',
                required: ['listname'],
                properties: {
                    listname: {
                        type: 'string',
                        enum: store.listnames
                    }
                }
            }
        },
        handler: (req, rep) => {
            const { listname } = req.params
            rep.send(store[listname])
        }
    })
    fastify.route({
        method: 'DELETE',
        url: route + '/:listname',
        schema: {
            description: 'Remove all items from named list',
            tags: ['store'],
            params: {
                type: 'object',
                required: ['listname'],
                properties: {
                    listname: {
                        type: 'string',
                        enum: store.listnames
                    }
                }
            }
        },
        handler: (req, rep) => {
            const { listname } = req.params
            store.empty(listname)
            return store[listname]
        }
    })
    fastify.route({
        method: 'DELETE',
        url: route + '/:listname/:uri',
        schema: {
            description: 'Remove item from list',
            tags: ['store'],
            params: {
                type: 'object',
                required: ['listname', 'uri'],
                properties: {
                    listname: {
                        type: 'string',
                        enum: store.listnames
                    },
                    uri: {
                        type: 'string'
                    }
                }
            }
        },
        handler: (req, rep) => {
            const { listname, uri } = req.params
            return store.remove(listname, uri)
        }
    })
}