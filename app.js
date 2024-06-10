const createWebToken = require('./createWebToken');
const printWebToken = require('./createWebToken');
const createDelivery = require('./createDelivery');

const token = createWebToken();
printWebToken(token);
createDelivery(token);
