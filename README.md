# Hello RabbitMQ

This is a play project to learn about RabbitMQ and connecting to if from NodeJS using the amqplib client library

# Getting RabbitMQ

1 https://cloudamqp.com sign up and you are done.  
2 Install it using docker.
   
    docker run -d --hostname bitstack-rabbit --name bitstack-rabbit -p 7091:15672 -p 5672:5672 rabbitmq:3-management-alpine
