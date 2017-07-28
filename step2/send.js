require('dotenv').config()

const debug = require('debug')
const log = debug('bitstack:step2:send')

const RabbitService = require('./RabbitService')

const rabbitUrl = process.env.RABBIT_URL || 'localhost'
log('Hello', rabbitUrl)

RabbitService({url: rabbitUrl})

RabbitService.prototype.send("Hello")

setTimeout(RabbitService.closeConnection, 2000)