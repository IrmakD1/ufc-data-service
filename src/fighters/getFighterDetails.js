const _ = require('lodash')
const logger = require('../logger')
const firebase = require('../firebase')
const sportsRadar = require('../sportsRadar')
const { wait } = require('../utils')

const getFighterDetails =  async (db, fighterId) => {
    if (Array.isArray(fighterId)) {
        if (fighterId.length > 0) {
            for (const id of fighterId) {
                
                const fighterDetails= []
                try {
                    logger().info('Getting fighter details from sportsRadar')
                    const res = await sportsRadar.getFighterDetails(id)
                    
                    fighterDetails.push(res)
                    await firebase.addFighterDetails(fighterDetails, db, id)
                    await wait(1001)
                } catch (err) {
                    logger().error(`Failed to get Fighter details: ${err}`)
                }
            }
        } else {
            logger().error('FighterId array is empty')
        }
    } else {
        try {
            logger().info('Getting fighter details from sportsRadar')
            const res = await sportsRadar.getFighterDetails(fighterId)
            
            await firebase.addFighterDetails(res, db, fighterId)
        } catch (err) {
            logger().error(`Failed to get Fighter details: ${err}`)
        }
    }
}

module.exports = getFighterDetails