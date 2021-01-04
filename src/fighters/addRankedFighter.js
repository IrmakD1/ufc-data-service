const _ = require('lodash')
const firebase = require('../firebase')
const logger = require('../logger')

const findFighterDetails = (fighterRecords, fighterDetails, fighterId, rank, weightclass) => {
    const record = _.filter(fighterRecords, record => record.competitor.id === fighterId)

    const details = _.filter(fighterDetails, details => details.competitor_id === fighterId)

    return ({ record: {...record[0]}, details: {...details[0]}, rank, weightclass })
}


const addRankedFighter = async (fighterId, rank, weightclass, db) => {
    try {
        const fighterRecords = await firebase.getAllFighterRecords(db)
        const fighterDetails = await firebase.getAllFighterDetails(db)

        const fighterTotalDetails = findFighterDetails(fighterRecords, fighterDetails, fighterId, rank, weightclass)
        await firebase.addRankedFighter([fighterTotalDetails], db)
    } catch (err) {
        logger().error(`Error getting fighter Records: ${err}`)
    }

}

module.exports = addRankedFighter