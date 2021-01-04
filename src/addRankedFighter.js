require('dotenv').config()

const logger = require('./logger')
const connectDb = require('./store')
const fighters = require('./fighters')

const db = connectDb()

const fighterId = !process.argv.slice(2)[0] ? process.env.FIGHTER_ID : process.argv.slice(2)[0]
const rank = !process.argv.slice(2)[1] ? process.env.FIGHTER_RANK : process.argv.slice(2)[1]
const weightclass = !process.argv.slice(2)[1] ? process.env.WEIGHTCLASS : process.argv.slice(2)[2]

fighters.addRankedFighter(fighterId, rank, weightclass, db)
    .then(() => logger().info('All done getting records!'))
    .catch(e => {
        logger().error(`Failed to load data to DB: "${e.message}"`);
        process.exit(1);
    });
