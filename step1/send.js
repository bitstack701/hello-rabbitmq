#!/usr/bin/env node
const debug = require('debug')
const log = debug('bitstack:step1:send')

require('dotenv').config()

const amqp = require('amqplib/callback_api')

const rabbitUrl = process.env.RABBIT_URL || 'localhost'

log(`Connecting to ${rabbitUrl}`)
amqp.connect(rabbitUrl, function(err, conn) {
  log("Connected!")
  conn.createChannel(function(err, ch) {
    const q = 'hello';
    const msg = 'Hello World!';

    ch.assertQueue(q, {durable: false});
    // Note: on Node 6 Buffer.from(msg) should be used
    ch.sendToQueue(q, new Buffer(msg));
    log(" [x] Sent %s", msg);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});