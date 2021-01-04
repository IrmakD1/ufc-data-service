const _ = require('lodash')
const firebase = require('../firebase')
const sportsRadar = require('../sportsRadar')
const logger = require('../logger')
const { wait } = require('../utils')

const findEventDetails = (eventDetails, eventId) => {
    const show = _.map(eventDetails, show => {
        showId = show.summaries[0].sport_event.sport_event_context.season.id
        return showId === eventId ? show : null
    })

    return _.filter(show, event => event !== null)
}

const getFighterList = (eventDetails) => _.map(eventDetails, details => {
    const fighters = []
    _.forEach(details.summaries, summary => {
        const competitors = _.get(summary, 'sport_event.competitors')
        fighters.push(competitors[0], competitors[1])
    })
    return fighters
})

const sortFighterIds = (array) => {
    const fightersArray = array[0] 
    return _.map(fightersArray, fighter => fighter.id)
}

const getAllRecords = async (fighterIds, option) => {
    const recordsArray = []
    for (const id of fighterIds) {
        if (option === 'records') {
            try {
                const res = await sportsRadar.getFighterRecord(id)
                recordsArray.push(res)
        
                await wait(1001)
            } catch (err) {
                logger().error(`Failed to get Fighter Records: ${err}`)
            }
        }
        if (option === 'details') {
            try {
                const res = await sportsRadar.getFighterDetails(id)
                recordsArray.push(res)
        
                await wait(1001)
            } catch (err) {
                logger().error(`Failed to get Fighter Details: ${err}`)
            }
        }
    }

    return recordsArray
} 

const getFighterRecords = async (options, db, details) => {
    if (options.eventId !== null) {
        try {
            const allEvents = await firebase.getAllEventDetails(db)
            const eventToSearch = findEventDetails(allEvents, options.eventId)
            const ListOfFighters = getFighterList(eventToSearch)
            const fighterIds = sortFighterIds(ListOfFighters)
           

            if (details !== true) {
                const fighterRecords = await getAllRecords(fighterIds, 'records')

                await firebase.addFighterRecords(fighterRecords, db)
            } else {
                for( const id of fighterIds) {
                    const fighterDetails = await getAllRecords([id], 'details')

                    await firebase.addFighterDetails(fighterDetails, db, id)
                }
            }

        } catch (err) {
            logger().error(`Error getting fighter Records: ${err}`)
        }
    }
    if (options.fighterId !== null) {
        if (details !== true) {
            try {
                const fighterRecord = await getAllRecords([options.fighterId], 'records')
        
                await firebase.addFighterRecords(fighterRecord, db)
            } catch (err) {
                logger().error(`Error getting fighter Records: ${err}`)
            }
        } else {
            try {
                const fighterDetails = await getAllRecords([options.fighterId], 'details')
        
                await firebase.addFighterDetails(fighterDetails, db, options.fighterId)
            } catch (err) {
                logger().error(`Error getting fighter details: ${err}`)
            }
        }
    }
} 


module.exports = getFighterRecords