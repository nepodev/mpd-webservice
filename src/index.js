
const settings = require('./settings')

const fastify = require('fastify')(settings.fastify)

// system wide plugins
fastify.register(require('fastify-cors'), settings.cors)
fastify.register(require('fastify-oas'), settings.swagger)
fastify.register(require('./plugin/store'), settings.store)

// routes
fastify.register(require('./route/mpd'), settings.mpd)
fastify.register(require('./route/station'), settings.station)
fastify.register(require('./route/store'))

  // Run the server!
  const start = async () => {
    try {
      await fastify.listen(settings.server)
      fastify.oas()
      fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start()
  