require('dotenv').config()

const logger = require('./logger')
const connectDb = require('./store')
const events = require('./events')


const db = connectDb()

events.getEventListDetails(db)
    .then(() => logger().info('All done!'))
    .catch(e => {
        logger().error(`Failed to load data to DB: "${e.message}"`);
        process.exit(1);
    });
    