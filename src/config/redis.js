import { createClient } from 'redis'

let client

function initClient() {
    return createClient()
        .on('ready', () => console.log('Opened connection to Redis'))
        .on('end', () => console.log('Closed connection to Redis'))
        .connect()
}

async function getClient() {
    if(client === undefined) {
        client = await initClient()
    }
    return client
}

async function disconnect() {
    (await client).disconnect()
}

const redis = {
    get instance() {
        return getClient()
    },
    disconnect,
}

export default redis
