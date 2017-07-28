#!/usr/bin/env node

/**
 * Manage a rabbit connection.
 * Try share a connection across queues
 * If a connection fails we need to reconnect and try again.
 */

const debug = require('debug')
const log = debug('bitstack:Rabitify')

const amqp = require('amqplib/callback_api')

function RabbitService({url}) {
  RabbitService.prototype.config = {url}
  amqp.connect(url, function(err, conn) {
    if (err) {
      log(`Error connecting to RabbitMQ ${url}`, err)
    } else {
      log("Connected!")
      RabbitService.prototype.connection = conn
    }
  });
}


RabbitService.prototype.connection = undefined

RabbitService.prototype.connect = () => {
  const {url} =  RabbitService.prototype.config
  amqp.connect(url, function(err, conn) {
    if (err) {
      log(`Error connecting to RabbitMQ ${url}`, err)
    } else {
      log("Connected!")
      RabbitService.prototype.connection = conn
    }
  });
}

RabbitService.prototype.send = (msg) => {
  const {connection} =  RabbitService.prototype
  connection.createChannel(function(err, ch) {
    const q = 'hello';
    ch.assertQueue(q, {durable: false});
    ch.sendToQueue(q, new Buffer(msg));
    log(" [x] Sent %s", msg);
  });
}

RabbitService.prototype.registerConsumer = ({cb}) => {
  const {connection} =  RabbitService.prototype
  connection.createChannel(function(err, ch) {
    const q = 'hello';

    ch.assertQueue(q, {durable: false});
    log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      log(" [x] Received %s", msg.content.toString());
      cb && cb(msg.content.toString())
    }, {noAck: true});
  });
}

RabbitService.prototype.closeConnection = () => {
  log('Closing connection')
  const {connection} =  RabbitService.prototype
  connection.close()
  process.exit(0)
}

module.exports = RabbitService
