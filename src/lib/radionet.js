const axios = require('axios')
axios.defaults.headers.common['User-Agent'] = 'XBMC Addon Radio'

const DEFAULT_URLS = {
    en: 'https://api.radio.net/info',
    de: 'https://api.radio.de/info',
    at: 'https://api.radio.at/info',
    fr: 'https://api.radio.fr/info',
    es: 'https://api.radio.es/info',
    pt: 'https://api.radio.pt/info',
    it: 'https://api.radio.it/info',
    pl: 'https://api.radio.pl/info',
    dk: 'https://api.radio.dk/info',
    se: 'https://api.radio.se/info',
}

const CATEGORY_TYPES = [
    'city',
    'country',
    'genre',
    'language',
    'topic'
]

const SORT_TYPES = [
    'RANK',
    'STATION_NAME'
]

const getData = response => response.data

const isCategory = category => CATEGORY_TYPES.indexOf(category) === -1 ? false : true

const transformResponse = function(data) {
    try {
        data = JSON.parse(data)
    }
    catch(e) {
        return data
    }

    if (typeof data === 'object' && data.hasOwnProperty('categories') && Array.isArray(data.categories) && data.categories.length > 0) {
        const obj = data.categories.shift()
        for(const [key, val] of Object.entries(obj)) {
            data[key] = val
        }
        delete data.categories
    }
    return data
}

const client = axios.create({
    baseURL: DEFAULT_URLS.en,
    validateStatus: function (status) {
        return status >= 200 && status < 500;
    }
})

const Radionet = {

    set language(lang) {
        lang = lang.toLowerCase()
        if (! DEFAULT_URLS.hasOwnProperty(lang)) {
            throw Error(`Language ${lang} undefined.`)
        }
        client.defaults.baseURL = DEFAULT_URLS[lang]
    },

    get language() {
        for(const [key, val] of Object.entries(DEFAULT_URLS)) {
            if (val === client.defaults.baseURL) {
                return key
            }
        }
    },

    /**
     * set lanuage. for available languages see Radionet.language_types
     * 
     * @param {string} lang
     */
    setLanguage: lang => {
        lang = lang.toLowerCase()
        if (! DEFAULT_URLS.hasOwnProperty(lang)) {
            throw Error(`Language ${lang} undefined.`)
        }
        client.defaults.baseURL = DEFAULT_URLS[lang]
    },

    getLocalStations(pageindex=1, sizeperpage=50) {
        const params = {pageindex, sizeperpage}
        return client.get('/v2/search/localstations', { params, transformResponse}).then(getData)
    },

    getRecommendedStations() {
        return client.get('/v2/search/editorstips').then(getData)
    },

    /**
     * get station details
     * 
     * @param {integer} station_id
     * @param {string} section deprecated 
     */
    getStation (station_id) {
        let route = '/v2/search/station'
        let params = {station: station_id}
        return client.get(route, { params }).then(getData)
    },

    /**
     * Fulltext station search
     * 
     * @param {string} query searchterm
     * @param {integer} pageindex optional. default 1
     * @param {integer} sizeperpage optional. default 50
     * @param {string} sorttype optional. default STATION_NAME
     */
    searchStations(query, pageindex=1, sizeperpage=50, sorttype='STATION_NAME') {
        const params = { query, pageindex, sizeperpage, sorttype }
        return client.get('/v2/search/stations', { params, transformResponse }).then(getData)
    },

    /**
     * get list of stations by categorie
     * 
     * @param {string} category <genre|topic|city|country|language>
     * @param {string} query searchterm
     * @param {integer} pageindex optional default: 1
     * @param {integer} sizeperpage optional. default: 50
     * @param {string} sorttype optional default: STATION_NAME 
     */
    getStationsByCategory(category, query, pageindex=1, sizeperpage=50, sorttype='STATION_NAME') {
        if (! isCategory(category)) {
            throw Error('Unknown Category')
        }

        const url = '/v2/search/stationsby' + category
        const params = {pageindex, sizeperpage, sorttype}
        params[category] = query

        return client.get(url, { params, transformResponse }).then(getData)
    },

    /**
     * shorthand for getStationsByCategory('genre', <query>[, ...])
     * @param  {...any} params 
     */
    getStationsByGenre(...params) {
        return this.getStationsByCategory('genre', ...params)
    },

    getStationsByTopic(...params) {
        return this.getStationsByCategory('topic', ...params)
    },

    getStationsByCountry(...params) {
        return this.getStationsByCategory('country', ...params)
    },

    getStationsByCity(...params) {
        return this.getStationsByCategory('city', ...params)
    },

    getStationsByLanguage(...params) {
        return this.getStationsByCategory('language', ...params)
    },

    /**
     * get list of category
     * 
     * @param {string} category <genre|topic|city|country|language>
     * @param {string} country optional. Only considered if category is city
     */
    getCategory (category, country=null) {

        if (! isCategory(category)) {
            throw Error('Unknown Category')
        }

        const params = country !== null ? { country } : {}
        var url

        switch (category)
        {
            case 'city':
                url  = '/v2/search/getcities'
                break
            case ' country':
                url = '/v2/search/getcountries'
                break
            default:
                url = '/v2/search/get' + category + 's'        
        }

        return client.get(url, { params }).then(getData)
    },

    getGenres() {
        return this.getCategory('genre')
    },

    getTopics() {
        return this.getCategory('topic')
    },

    getLanguages() {
        return this.getCategory('language')
    },

    getCountries() {
        return this.getCategory('country')
    },

    getCities(country=null) {
        return this.getCategory('city', country)
    },
    
    /**
     * list of categories that can used in getCategory() and getStationsByCategory()
     * 
     * @var {array}
     */
    get categories() {
        return CATEGORY_TYPES.slice(0)
    },

    /**
     * List available sorttypes
     * 
     * @var {array}
     */
    get sorttypes() {
        return SORT_TYPES.slice(0)
    },

    /**
     * list of tld that can be used in setLocation
     * 
     * @var {array}
     */
    get languages() {
        return Object.keys(DEFAULT_URLS)
    }
}

module.exports = Radionet