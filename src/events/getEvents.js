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

const filterFutureEvents = (data) => {
    const eventsThisYear = filterEvents(data)
    
    const today = new Date()

    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    const date = yyyy + mm + dd;

    const eventList = _.map(eventsThisYear, competition => {
        const eventDate = competition.start_date.replace(/-/g, '')
        const parsedDate = parseInt(date, 10)
        const parsedEventDate = parseInt(eventDate, 10)

        if (parsedEventDate > parsedDate) return competition 
        return null
    })

    return _.filter(eventList, events => events !== null)
}

const getEvents = async (db, getFutureEvents = null) => {
    const eventList = await sportsRadar.getEventsList()

    if (getFutureEvents === null) {
        const eventsThisYear = filterEvents(eventList)
        await firebase.addEventList(eventsThisYear, db)
    } else if (getFutureEvents === true) {
        const futureEventsToAdd = filterFutureEvents(eventList)
        await firebase.addEventList(futureEventsToAdd, db)

        return futureEventsToAdd
    }
}

module.exports = getEvents