const radionet = require('../lib/radionet')

const PROPS = {
    query: {
        description: 'Searchterm',
        type: 'string'
    },
    pageindex: {
        type: 'integer',
        default: 1
    },
    sizeperpage: {
        type: 'integer',
        default: 50
    },
    sorttype: {
        type: 'string',
        enum: radionet.sorttypes,
        default: 'STATION_NAME'
    },
    category: {
        type: 'string',
        enum: radionet.categories
    },
    language: {
        type: 'string',
        enum: radionet.languages
    }
}

module.exports = async (fastify, options) => {
    const route = '/station'

    const { language } = options
    if (language) {
        radionet.language = language
    }
    
    fastify.route({
        method: 'GET',
        url: route,
        schema: {
            description: 'Get default config.',
            tags: ['station']
        },
        handler: () => {
            return {
                language: radionet.language,
                languages: radionet.languages
            } 
        }
    })
    fastify.get(
        route + '/searchby/:category',
        {
            schema: {
                tags: ['station'],
                description: 'Get Stations by category',
                required: ['category', 'query'],
                params: {
                    type: 'object',
                    properties: {
                        category: PROPS.category
                    }
                },
                query: {
                    type: 'object',
                    properties: {
                        query: PROPS.query,
                        pageindex: PROPS.pageindex,
                        sizeperpage: PROPS.sizeperpage,
                        sorttype: PROPS.sorttype,
                        language: PROPS.language
                    }
                }
            }
        },
        async (req, rep) => {
            const { query, pageindex, sizeperpage, sorttype } = req.query
            return await radionet.getStationsByCategory(req.params.category, query, pageindex, sizeperpage, sorttype)
        }
    )

    fastify.get(
        route + '/search',
        {
            schema: {
                tags: ['station'],
                description: 'Search stations',
                query: {
                    type: 'object',
                    required: ['query'],
                    properties: {
                        query: PROPS.query,
                        pageindex: PROPS.pageindex,
                        sizeperpage: PROPS.sizeperpage,
                        sorttype: PROPS.sorttype
                    }
                }
            }
        },
        async (req, rep) => {
            const { query, pageindex, sizeperpage, sorttype } = req.query
            return await radionet.searchStations(query, pageindex, sizeperpage, sorttype)
        }
    )

    fastify.get(
        route + '/station/:id',
        {
            schema: {
                tags: ['station'],
                description: 'Get station details',
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' }
                    }
                }
            }
        },
        async (req, rep) => {
            return await radionet.getStation(req.params.id)
        }
    )

    fastify.get(
        route + '/localstations',
        {
            schema: {
                tags: ['station'],
                description: 'Get Local Stations',
                query: {
                    pageindex: PROPS.pageindex,
                    sizeperpage: PROPS.sizeperpage,
                    language: PROPS.language
                }
            }
        },
        async (request, reply) => {
            const { pageindex, sizeperpage } = request.query
            return await radionet.getLocalStations(pageindex, sizeperpage)
        }
    )
    
    fastify.get(
        route + '/editorstips',
        {
            schema: {
                tags: ['station'],
                description: 'Recommandet Stations',
            }
        },
        async (request, reply) => {
            return await radionet.getRecommendedStations()
        }
    )

    fastify.get(
        route + '/categories',
        {
            schema: {
                tags: ['station'],
                description: 'Available categories',
                query: {
                    type: 'object',
                    properties: {
                        language: PROPS.language
                    }
                }
            }
        },
        async (request, reply) => {
            return radionet.categories
        }
    )

    fastify.get(
        route + '/category/:category',
        {
            schema: {
                description: 'Get list from categorie',
                tags: ['station'],
                params: {
                    category: PROPS.category
                },
                query: {
                    type: 'object',
                    properties: {
                        country: {
                            type: ['string']
                        },
                        language: PROPS.language
                    }
                }
            }
        },
        async (request, reply) => {
            return await radionet.getCategory(request.params.category, request.query.country)
        }
    )
}