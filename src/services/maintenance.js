import redis from '../config/redis'

async function isMaintenanceModeEnabled() {
    const db = await redis.instance
    const value = await db.get('maintenance_mode')
    return value === 'true'
}

function maintenance(app) {
    app.use(async (_, res, next) => {
        const value = await isMaintenanceModeEnabled()
        value ? res.sendStatus(503) : next()
    })
}

async function enableMaintenanceMode() {
    const db = await redis.instance
    await db.set('maintenance_mode', 'true')
}

async function disableMaintenanceMode() {
    const db = await redis.instance
    await db.set('maintenance_mode', 'false')
}

export { maintenance, enableMaintenanceMode, disableMaintenanceMode }
