const _ = require('lodash')
const firebase = require('../firebase')
const sportsRadar = require('../sportsRadar')
const logger = require('../logger')
const getFighterDetails = require('./getFighterDetails')
const { wait } = require('../utils')

const findEventDetails = (eventDetails, eventId) => {
    const show = _.map(eventDetails, show => {
        showId = show.summaries[0].sport_event.sport_event_context.season.id
        return showId === eventId ? show : null
    })

    return _.filter(show, event => event !== null)
}

const sortFighterIds = (array) => {
    const fightersArray = array[0] 
    return _.map(fightersArray, fighter => fighter.id)
}

const getFighterList = (eventDetails) => _.map(eventDetails, details => {
    const fighters = []
    _.forEach(details.summaries, summary => {
        const competitors = _.get(summary, 'sport_event.competitors')
        fighters.push(competitors[0], competitors[1])
    })
    return fighters
})

const getAllRecords = async (fighterIds) => {
    const recordsArray = []
    for (const id of fighterIds) {
        try {
            const res = await sportsRadar.getFighterRecord(id)
            recordsArray.push(res)
    
            await wait(1001)
        } catch (err) {
            logger().error(`Failed to get Fighter Records: ${err}`)
        }

    }

    return recordsArray
} 

const getFighterRecords = async (db, eventId, details = false) => {
    try {
        const allEvents = await firebase.getAllEventDetails(db)
        const eventToSearch = findEventDetails(allEvents, eventId)
        const ListOfFighters = getFighterList(eventToSearch)
        const fighterIds = sortFighterIds(ListOfFighters)

        if (details === true) {
            await getFighterDetails(db, fighterIds)
        } else {
            const fighterRecords = await getAllRecords(fighterIds)
    
            await firebase.addFighterRecords(fighterRecords, db)
        }
    } catch (err) {
        logger().error(`Error getting fighter Records: ${err}`)
    }
}

module.exports = getFighterRecords
