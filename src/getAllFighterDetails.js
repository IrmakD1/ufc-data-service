require('dotenv').config()

const logger = require('./logger')
const connectDb = require('./store')
const fighters = require('./fighters')

const db = connectDb()

const eventId = !process.argv.slice(2)[0] ? process.env.EVENT_ID : process.argv.slice(2)[0]

fighters.getFighterRecords({ fighterId: null, eventId }, db, false)
    .then(() => logger().info('All done getting records!'))
    .then(() => fighters.getFighterRecords({ fighterId: null, eventId }, db, true))
    .then(() => logger().info('All done getting details!'))
    .catch(e => {
        logger().error(`Failed to load data to DB: "${e.message}"`);
        process.exit(1);
    });




