/**
 * store.js
 * 
 */
"use strict";

const { Store } = require('data-store')

const LISTNAMES = [
    'favorites',
    'recent'
];

const DEFAULT_CONFIG = {
    file: null,
    max_recent: 50,
    max_favorites: 0
}

class myStore {

    constructor(options) {
        this._settings = Object.assign(DEFAULT_CONFIG, options)
        this._store = new Store({path: this._settings.file})

        LISTNAMES.forEach(listname => 
            this._store.hasOwn(listname)||this._store.set(listname, [])
        )
    }

    get favorites() {
        return this._store.get('favorites')
    }

    get recent() {
        return this._store.get('recent')
    }

    get listnames() {
        return LISTNAMES.slice(0)
    }
    
    add(listname, data) {
        let list = this[listname].filter(item => item.uri !== data.uri)
        list.unshift(data)

        const max = this._settings['max_' + listname]
        if (max) {
            list = list.slice(0, max)
        }
        this._store.set(listname, list)
    }

    empty(listname) {
        this._store.set(listname, [])
    }

    remove(listname, uri) {
        const list = this[listname].filter(item => item.uri !== uri)
        this._store.set(listname, list)
        return list
    }

    search(key, value) {
        const all = this._store.get()
        let list = []
        Object.keys(all).forEach(name => list = list.concat(all[name]));
        return (list.filter(item => item[key] == value)).shift();
    }
    
}

module.exports = myStore
