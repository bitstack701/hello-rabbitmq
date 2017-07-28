require('dotenv').config()

const debug = require('debug')
const log = debug('bitstack:step2:test')

const rabbitUrl = process.env.RABBIT_URL || 'localhost'

const Service = require('./Service')
// const conn = Service.connect({url: rabbitUrl})
// const ch = Service.createChannel({conn})
// log(ch)
// Service.assertQueue({channel: ch, queue: 'hello'})
// Service.sendToQueue({channel: ch, queue: 'hello', msg: 'hello world'})
//
// setTimeout(()=> conn.close(), 2000)

const q = 'hello'
const msg = 'hello world'

// Service.send({url: rabbitUrl, q, msg})
Service.read({url: rabbitUrl, q, handler: ({ch, msg}) => {
  if (msg !== null) {
    log(`Receiving msg`, msg.content.toString());
    ch.ack(msg);
  }
}})

setInterval((i)=> {
  log('Sending msg', i)
  Service.send({url: rabbitUrl, q, msg: `${msg} - ${i}`})
}, 4000)
