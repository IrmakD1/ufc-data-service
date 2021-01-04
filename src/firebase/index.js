const logger = require('../logger')
const _ = require('lodash')

const getAllEventList = async (db) => {
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

const getAllEventDetails = async (db) => {
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

const getAllFighterRecords = async (db) => {
    let fighterRecordsResults = []
    
    const fighterRecordsRef = db.collection('Fighter Records')

    try {
        const snapshot = await fighterRecordsRef.get()

        if (snapshot.empty) {
            throw new Error('Could not find any valid records')
        }  

        logger().info('Successfully retrieved Fighter Records from db')

        snapshot.forEach(doc => {

            const res = doc.data()

            fighterRecordsResults.push(res)
        })

        return _.filter(fighterRecordsResults, fighterRecord => fighterRecord.competitor !== undefined)
    } catch (err) {
        throw new Error(`Could not retrieve existing records: ${err}`)
    }
}

const getAllFighterDetails = async (db) => {
    let fighterDetailsResults = []
    
    const fighterDetailsRef = db.collection('Fighter Details')

    try {
        const snapshot = await fighterDetailsRef.get()

        if (snapshot.empty) {
            throw new Error('Could not find any valid records')
        }  

        logger().info('Successfully retrieved Fighter Records from db')

        snapshot.forEach(doc => {

            const res = doc.data()

            fighterDetailsResults.push(res)
        })

        return _.filter(fighterDetailsResults, fighterDetail => fighterDetail.competitor_id !== undefined)
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
        const eventId = show.summaries[0].sport_event.sport_event_context.season.id
        const newShow = {...show, eventId}
        try {
            const docRef = db.collection('Event Details').doc(newShow.eventId)
            await docRef.set(newShow)
            logger().info(`Successfully added event document ${newShow.eventId} to Event Details collection`)
        } catch (err) {
            logger().error(`Unable to add event details to Event Details collection: ${err}`);
        }
    })
}

const addFighterRecords = async (fightersRecords, db) => {
    logger().info('Adding fighter records to the fighterDb')
    _.forEach(fightersRecords, async (record) => {
        try {
            const docRef = db.collection('Fighter Records').doc(record.competitor.id)
            await docRef.set(record)
        } catch (err) {
            logger().error(`Unable to add fighter record details to Fighter Records collection: ${err}`);
        }
    })
}

const addFighterDetails = async (fightersDetails, db, fighterId) => {
    logger().info('Adding fighter details to the fighterDb')
    _.forEach(fightersDetails, async (details) => {
        const newDetails = {...details, competitor_id: fighterId}
        try {
            const docRef = db.collection('Fighter Details').doc(newDetails.competitor_id)
            await docRef.set(newDetails)
        } catch (err) {
            logger().error(`Unable to add fighter record details to Fighter Records collection: ${err}`);
        }
    })
}

const addRankedFighter = async (fightersDetails, db) => {
    logger().info('Adding fighter records to the rankingsDb')
    _.forEach(fightersDetails, async (record) => {
        try {
            const docRef = db.collection('Rankings').doc(record.details.competitor_id)
            await docRef.set(record)
        } catch (err) {
            logger().error(`Unable to add ranked fighter details to Rankings collection: ${err}`);
        }
    })
}

module.exports = {
    addEventList,
    addEventDetails,
    addFighterDetails,
    addFighterRecords,
    addRankedFighter,
    getAllEventList,
    getAllEventDetails,
    getAllFighterRecords,
    getAllFighterDetails
}