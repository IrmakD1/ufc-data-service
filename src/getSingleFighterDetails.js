require('dotenv').config()

const logger = require('./logger')
const connectDb = require('./store')
const fighters = require('./fighters')

const db = connectDb()

const fighterId = !process.argv.slice(2)[0] ? process.env.FIGHTER_ID : process.argv.slice(2)[0]

fighters.getFighterRecords({ fighterId, eventId: null }, db, false)
    .then(() => logger().info('All done getting records!'))
    .then(() => fighters.getFighterRecords({ fighterId, eventId: null }, db, true))
    .then(() => logger().info('All done getting details!'))
    .catch(e => {
        logger().error(`Failed to load data to DB: "${e.message}"`);
        process.exit(1);
    });


