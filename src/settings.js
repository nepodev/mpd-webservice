const { version, description } = require('../package.json')

const settings = {
    server: {
        host: "localhost",
        port: 3000
    },
    fastify: {
        logger: true,
    },
    cors: {
        origin: true
    },
    mpd: {
        host: 'localhost',
        port: '6600'
    },
    store: {
      file: 'store.json',
      max_recent: 50, // 50 items in history
      max_favorites: 0 // disable max
    },
    station: {
      language: 'en'
    },
    swagger: {
        routePrefix: '/doc',
        exposeRoute: true,
        swagger: {
          info: {
            title: 'MPD Webservice API',
            description,
            version,
          },
          servers: [
            {
              url: 'http://localhost:3000',
              description: 'Dev Server',
            }
          ],
          // externalDocs: {
          //   url: 'https://swagger.io',
          //   description: 'Find more info here',
          // },
          consumes: ['application/json'],
          produces: ['application/json'],
          tags: [
            {
              name: 'mpd',
              description: 'MPD related endpoints'
            },
            {
              name: 'station',
              description: 'Radiostation related endpoints.'
            },
            {
              name: 'store',
              description: 'Store related endpoints.'
            }
          ]
        }
      }
}

try {
  const sections = ['server', 'fastify', 'mpd', 'cors', 'store', 'station']
  const custom = require('../config.json')
  sections.forEach(section => {
    if (custom[section]) {
      settings[section] = custom[section]
    }
  })
}
catch(e) {
    /* ignore */
    console.log('No config.json found ')
}

module.exports = settings