import scheduleTasks from './database-job'

let tasks

function initCronJobs() {
    if(tasks) {
        throw new Error('Cron jobs were initialized')
    }
    tasks = {...tasks, ...scheduleTasks()}
}

export { initCronJobs, tasks }
