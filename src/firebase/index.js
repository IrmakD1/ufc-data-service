const logger = require('../logger')
const _ = require('lodash')

const getEventList = async (db) => {
    let eventResults = []
    
    const eventsRef = db.collection('Events')

    try {
        const snapshot = await eventsRef.get()

        if (snapshot.empty) {
            throw new Error('Could not find any valid records')
        }  

        logger().info('Successfully retrieved Events from db')

        snapshot.forEach(doc => {

            const res = doc.data()

            eventResults.push(res)
        })

        return eventResults
    } catch (err) {
        throw new Error(`Could not retrieve existing records: ${err}`)
    }
}

const getEventDetails = async (db) => {
    let eventDetailsResults = []
    
    const eventDetailsRef = db.collection('Event Details')

    try {
        const snapshot = await eventDetailsRef.get()

        if (snapshot.empty) {
            throw new Error('Could not find any valid records')
        }  

        logger().info('Successfully retrieved Event Details from db')

        snapshot.forEach(doc => {

            const res = doc.data()

            eventDetailsResults.push(res)
        })

        return _.filter(eventDetailsResults, eventDetails => eventDetails.summaries[0] !== undefined)
    } catch (err) {
        throw new Error(`Could not retrieve existing records: ${err}`)
    }
}

const addEventList = async (eventsList, db) => {
    for (const show of eventsList) {
        try {
            const docRef = db.collection('Events').doc(show.id)
            await docRef.set(show)
            
            logger().info(`Successfully added event document ${show.name} to Events collection`)
        } catch (err) {
            logger().error(`Unable to add event: ${show.name} to Events db: ${err}`);
        }
    }
}

const addEventDetails = async (events, db) => {
    logger().info('Adding event details to the eventDb')
    _.forEach(events, async (show) => {
        try {
            await db.collection('Event Details').add({...show})
            logger().info(`Successfully added event document ${show.name} to Events collection`)

        } catch (err) {
            logger().error(`Unable to add event details to Event Details collection: ${err}`);
        }
    })
}

module.exports = {
    addEventList,
    addEventDetails,
    getEventList,
    getEventDetails
}