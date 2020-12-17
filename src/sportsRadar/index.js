const axios = require('axios')
const _ = require('lodash')
const logger = require('../logger')

const key = process.env.API_KEY

const getEventsList = async () => {
    const url = `http://api.sportradar.us/ufc/trial/v2/en/seasons.json?api_key=${key}`

    try {
        logger().info('Getting events from SportsRadar')
        const { data } = await axios.get(url)
    
        logger().info('Successfully retrieved events from to SportsRadar')
        return data

    } catch (err) {
        logger().error(`Unable to get events from SportsRadar ${err}`);
        throw err;
    }
}

const wait = async (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

const getEventDetails = async (events) => {
    logger().info('Getting event details from SportsRadar')
    
    let eventDetailsArray = []

    for (const show of events) {
        
        const url = `http://api.sportradar.us/ufc/trial/v2/en/seasons/${show.id}/summaries.json?api_key=${key}`
        
        try {
            const { data } = await axios.get(url)
        
            logger().info(`Successfully got ${show.id}`)

            eventDetailsArray.push(data)

            await wait(1001)
    
        } catch (err) {
            logger().error(`Unable to get event details from SportsRader: ${err}`);
        }
    }

    return _.filter(eventDetailsArray, show => show.summaries.length > 0)
}

const getFighterRecord = async (id) => {
    const url = `http://api.sportradar.us/ufc/trial/v2/en/competitors/${id}/profile.json?api_key=${key}`
    try {
        const { data } = await axios.get(url)
    
        logger().info(`Successfully got ${id} fight record`)

        return data

    } catch (err) {
        logger().error(`Unable to get fighter record from SportsRader for ${id}: ${err}`);
    }
} 


module.exports = {
    getEventsList,
    getEventDetails,
    getFighterRecord
}