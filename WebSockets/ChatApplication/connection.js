//REDIS FILE:

import {Redis} from 'ioredis';

//Outgoing Messages:
export const redisPublish = new Redis({
    host: 'localhost',
    port: '6379'
});

//Incoming Messages:
export const redisSubscribe = new Redis({
    host: 'localhost',
    port: '6379'
});