const _ = require('lodash')

const sportsRadar = require('../sportsRadar')
const firebase = require('../firebase')


const filterEvents = (data) => {
    const thisYear = new Date().getFullYear()

    const eventList = _.map(data.seasons, competition => {
        const eventYear = competition.start_date.substring(0,4)

        return parseInt(eventYear) === thisYear ? competition : null
    })

    return _.filter(eventList, events => events !== null)
}

const getEvents = async (db) => {
    const eventList = await sportsRadar.getEventsList()
    const eventsThisYear = filterEvents(eventList)
    await firebase.addEventList(eventsThisYear, db)
}

module.exports = getEvents