const createWebToken = require('./createWebToken');
const createDelivery = require('./createDelivery');

const token = createWebToken();
console.log("web token: ", token);
createDelivery(token);
