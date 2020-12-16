const axios = require('axios')
const _ = require('lodash')

const logger = require('../logger')

const key = process.env.API_KEY


const filterEvents = (data) => {
    const thisYear = new Date().getFullYear()

    const eventList = _.map(data.seasons, competition => {
        const eventYear = competition.start_date.substring(0,4)

        return parseInt(eventYear) === thisYear ? competition : null
    })

    return _.filter(eventList, events => events !== null)
}


const getEventsList = async () => {
    const url = `http://api.sportradar.us/ufc/trial/v2/en/seasons.json?api_key=${key}`

    try {
        logger().info('Getting events from SportsRadar')
        const { data } = await axios.get(url)

        const eventsThisYear = filterEvents(data)
    
        logger().info('Successfully retrieved events from to SportsRadar')
        return eventsThisYear

    } catch (err) {
        logger().error(`Unable to get events from SportsRadar ${err}`);
        throw err;
    }
}

const addEventLists = async (eventsList, db) => {
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

const wait = async (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}


const getExistingEventDetails = async (eventList, db) => {
    let eventDetailsResults = []
    
    const eventDetailsRef = db.collection('Event Details')

    try {
        const snapshot = await eventDetailsRef.get()

        if (snapshot.empty) {
            throw Boom.badData('Could not find any valid records')
        }  

        logger().info('Successfully retrieved Event Details from db')

        snapshot.forEach(doc => {

            const res = doc.data()

            eventDetailsResults.push(res)
        })


        const filteredEventDetailsResults = _.filter(eventDetailsResults, eventDetails => eventDetails.summaries[0] !== undefined)

        const missingEvents = _.map(eventList, show => {
            let matchingEvent = false

            _.forEach(filteredEventDetailsResults, eventDetails => {

                const eventId = eventDetails.summaries[0].sport_event.sport_event_context.season.id
                if(show.id === eventId) matchingEvent = true
            })

            if (matchingEvent === false) return show.id
        })

        return _.filter(missingEvents, eventDetails => eventDetails !== undefined)

    } catch (err) {
        logger().error(`Unable to get events from db: ${err}`);
        throw(err)
    }
}

const getEventListDetails = async (eventList, db) => {

    const missingEvents = await getExistingEventDetails(eventList, db)

    logger().info('Getting event details from SportsRadar')

    for (const show of missingEvents) {
        const url = `http://api.sportradar.us/ufc/trial/v2/en/seasons/${show}/summaries.json?api_key=${key}`
        try {
            const { data } = await axios.get(url)
        
            logger().info(`Successfully got ${show.id}`)

            try {
                await db.collection('Event Details').add({...data})
                
                logger().info(`Successfully added event document ${show.name} to Events collection`)

            } catch(err) {
                logger().error(`Unable to add event details to Event Details collection: ${err}`);
            }

            await wait(1001)
    
        } catch (err) {
            logger().error(`Unable to get event details from SportsRader: ${err}`);
        }
    }
}

const getEvents = async (db) => {
    const eventList = await getEventsList()
    await addEventLists(eventList, db)
    await getEventListDetails(eventList, db)
}


module.exports = getEvents