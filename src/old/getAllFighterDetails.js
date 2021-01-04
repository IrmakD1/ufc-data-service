require('dotenv').config()

const logger = require('../logger')
const connectDb = require('../store')
const fighters = require('../fighters')

const db = connectDb()

fighters.getAllFighterDetails(db)
    .then(() => logger().info('All done!'))
    .catch(e => {
        logger().error(`Failed to load data to DB: "${e.message}"`);
        process.exit(1);
    });
    