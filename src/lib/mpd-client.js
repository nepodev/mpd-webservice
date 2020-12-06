'use strict'

//const util = require('util')
const mpdapi = require('mpd-api')
const { mpd } = mpdapi
const { EventEmitter } = require('events')

const MPC_DISCONNECTED = 1
const MPC_CONNECTING = 2
const MPC_RECONNECTING = 3
const MPC_READY = 4

const DEFAULT_SETTINGS = {
    host: "localhost",
    port: "6600"
};

class StatusEmitter extends EventEmitter {

    constructor() {
        super()
        this._status = {}
    }

    set status (data) {
        this._status = data;
        this.emit('change');
    }

    get status () {
        return this._status;   
    }
}


const readStatus = () => {
    return client.sendCommands(
        ['currentsong', 'status']
    )
    .then(data => {
        mpdState.status = mpdapi.mpd.parseObject(data)
    })
    .catch(error => {
        console.log('MPD Error', error)
    })
}

const onClose = () => {
    console.log('MPD connection closed')
    conState = MPC_DISCONNECTED
    reconnect()
}

const finaliseConnect = (client) => {
    client.on('close', onClose)
    client.on('system-player', readStatus)
    client.on('system-mixer', readStatus)
    readStatus()
    return client
}

const connect = () => {
    if (client !== null) {
        try {
            client.disconnect()
        }
        catch(e){ /* ignore */ }
    }

    conState = MPC_CONNECTING

    return mpdapi.connect(settings)
        .then(cl => {
            conState = MPC_READY
            client = cl
            return client
        })
        .then(finaliseConnect)
        .catch(error => {
            console.log('MPD Error' , error)
            conState = MPC_DISCONNECTED
            reconnect()
        })
}

const reconnect = () => {
    if(conState === MPC_RECONNECTING || conState === MPC_CONNECTING) {
        return
    }
    client = null
    conState = MPC_RECONNECTING
    setTimeout(connect, 3000)
}


const PLAYLIST_SUFFIX = [
    '.asx',
    '.cue',
    '.m3u',
    '.pls',
    '.rss',
    '.xml'
]

const isPlaylist = file => {
    const ext = file.substr(-4).toLowerCase()
    return PLAYLIST_SUFFIX.includes(ext)
}


let settings
let client = null
let conState = MPC_DISCONNECTED
let mpdState = new StatusEmitter()

const MpdClient = {

    mpdState, 
    
    client, 

    get status() {
        return mpdState.status
    },

    connect: function (options = null) {
        settings = Object.assign({}, (options === null ? DEFAULT_SETTINGS : options))
        return connect()
    },

    replaceplay: function(uri) {
        const add = isPlaylist(uri) ? 'load' : 'add'
        const commands = [
            mpd.cmd('clear', []),
            mpd.cmd(add, [uri]),
            mpd.cmd('play', []),
            //mpd.cmd('repeat',[1])
        ]
        client.sendCommands(commands)
        return
    }
}

module.exports = MpdClient
