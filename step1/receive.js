#!/usr/bin/env node
const debug = require('debug')
const log = debug('bitstack:step1:send')

require('dotenv').config()

var amqp = require('amqplib/callback_api');

const rabbitUrl = process.env.RABBIT_URL || 'localhost'

log(`Connecting to ${rabbitUrl}`)
amqp.connect(rabbitUrl, function(err, conn) {
  log("Connected!")
  conn.createChannel(function(err, ch) {
    var q = 'hello';

    ch.assertQueue(q, {durable: false});
    log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});

  });
});