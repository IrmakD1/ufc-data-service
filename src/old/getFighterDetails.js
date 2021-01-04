require('dotenv').config()

const logger = require('../logger')
const connectDb = require('../store')
const fighters = require('../fighters/old')

const db = connectDb()

const fighterId = !process.argv.slice(2)[0] ? process.env.FIGHTER_ID : process.argv.slice(2)[0]

fighters.getFighterDetails(db, fighterId)
    .then(() => logger().info('All done!'))
    .catch(e => {
        logger().error(`Failed to load data to DB: "${e.message}"`);
        process.exit(1);
    });
    