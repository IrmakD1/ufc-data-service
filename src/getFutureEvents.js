require('dotenv').config()

const logger = require('./logger')
const connectDb = require('./store')
const events = require('./events')
const fighters = require('./fighters')
const sportsRadar = require('./sportsRadar')
const firebase = require('./firebase')

const db = connectDb()

events.getEvents(db, true)
    .then(async (futureEvents) => {
        for (const show of futureEvents) {
            const eventsToAdd = await sportsRadar.getEventDetails([show])
    
            await firebase.addEventDetails(eventsToAdd, db)
    
            logger().info('Successfully added event details to db')
        }

        return futureEvents
    })
    .then(async (futureEvents) => {
        for (const show of futureEvents) {
            await fighters.getFighterRecords({ fighterId: null, eventId: show.id }, db, false)
            await fighters.getFighterRecords({ fighterId: null, eventId: show.id }, db, true)
        }
    })
    .then(() => logger().info('All done!'))
    .catch(e => {
        logger().error(`Failed to load data to DB: "${e.message}"`);
        process.exit(1);
    });