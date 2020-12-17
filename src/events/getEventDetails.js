const axios = require('axios')
const _ = require('lodash')

const logger = require('../logger')
const firebase = require('../firebase')
const sportsRadar = require('../sportsRadar')

const findMissingEvents = async (eventList, existingEventDetails) => {
    const missingEvents = _.map(eventList, show => {
        let matchingEvent = false
        _.forEach(existingEventDetails, eventDetails => {

            const eventId = eventDetails.summaries[0].sport_event.sport_event_context.season.id
            if(show.id === eventId) matchingEvent = true
        })

        if (matchingEvent === false) return show
    })

    return _.filter(missingEvents, eventDetails => eventDetails !== undefined)
}


const getEventListDetails = async (db, newEventList = []) => {
    const existingEvents = await firebase.getAllEventList(db)
    const existingEventDetails = await firebase.getAllEventDetails(db)

    let missingEvents

    missingEvents = newEventList.length === 0 
    ? await findMissingEvents(existingEvents, existingEventDetails) 
    : await findMissingEvents(newEventList, existingEventDetails)
    
    if (missingEvents.length > 0) {
        try {
            const eventsToAdd = await sportsRadar.getEventDetails(missingEvents)

            await firebase.addEventDetails(eventsToAdd, db)

            logger().info('Successfully added event details to db')
        } catch (err) {
            logger().error(`Unable to add event details to the db: ${err}`)
        }
    }
    else logger().info('No new events to add. Db is up to date!')
}

module.exports = getEventListDetails