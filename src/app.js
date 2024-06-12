const createWebToken = require('./doordash/createWebToken');
const createDelivery = require('./doordash/createDelivery');

const token = createWebToken();
console.log("web token: ", token);
createDelivery(token);
