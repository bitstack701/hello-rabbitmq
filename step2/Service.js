const amqp = require('amqplib')

const debug = require('debug')
const log = debug('bitstack:step2:Service')

module.exports.connect = async ({url}) => {
  log(`Opening a connection to ${url}`)
  const conn = await amqp.connect(url)
  return conn
}
module.exports.createChannel = async ({conn}) => {
  log(`Creating channel ${conn}`)
  return await conn.createChannel()
}
module.exports.assertQueue = async ({channel, queue}) => {
  log(`Asserting queue ${queue}`)
  return await channel.assertQueue(queue)
}
module.exports.sendToQueue = ({channel, queue, msg}) => {
  log(`Sending msg to queue ${msg}`)
  channel.sendToQueue(queue, new Buffer(msg))
}


module.exports.test = (url) => {
  const q = 'hello'
  const open = amqp.connect(url);

// Publisher
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(q, {durable: false}).then(function(ok) {
      return ch.sendToQueue(q, new Buffer('something to do'));
    });
  }).catch(console.warn);
}


let conn = undefined

async function ensureConnection({url}) {
  if (!conn) {
    log(`Opening a rabbit connection to ${url} started`)
    conn = await amqp.connect(url)
    log(`Opening a rabbit connection to ${url} finished`)
  }
}

module.exports.send = async ({url, q, msg}) => {
  log(`Sending message ${msg}`)
  await ensureConnection({url})
  const ch = await conn.createChannel();
  await ch.assertQueue(q, {durable: true})
  await ch.sendToQueue(q, new Buffer(msg));
}

module.exports.read = async ({url, q, handler}) => {
  log(`Listening for messages queue: ${q} starting`)
  await ensureConnection({url})

  const ch = await conn.createChannel();
  await ch.assertQueue(q, {durable: true})
  ch.prefetch(1);
  log(`Listening for messages queue: ${q} ready`)
  ch.consume(q, function(msg) {
    if (msg !== null) {
      handler({ch, msg})
    }
  });
}

module.exports.read2 = async ({url, q}) => {
  const open = amqp.connect(url)
  open.then(function(conn) {
    return conn.createChannel();
  }).then(function(ch) {
    return ch.assertQueue(q, {durable: false}).then(function(ok) {
      return ch.consume(q, function(msg) {
        if (msg !== null) {
          console.log(msg.content.toString());
          ch.ack(msg);
        }
      });
    });
  }).catch(console.warn);
}
