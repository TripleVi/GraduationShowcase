import * as statsService from '../services/stats-service'

const fetchStats = async (_, res) => {
    try {
        const result = await statsService.getStats()
        res.status(200).send(result)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export { fetchStats }
