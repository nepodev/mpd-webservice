const fp = require('fastify-plugin')
const Store = require('../lib/store')

function StorePlugin(fastify, options, next)
{
    const store = new Store(options)
    fastify.decorate('store', store)
    next()
}

module.exports = fp(StorePlugin)
