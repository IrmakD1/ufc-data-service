const _ = require('lodash')
const firebase = require('../firebase')

const getFighterRecords = require('./getFighterDetails')

const sortFighterIds = (fighters) => _.map(fighters, fighter => fighter.competitor.id)


const getAllFighterDetails = async (db) => {
    allFighters = await firebase.getAllFighterRecords(db)
    fighterIds = sortFighterIds(allFighters)
    await getFighterRecords(db, fighterIds)
}

module.exports = getAllFighterDetails