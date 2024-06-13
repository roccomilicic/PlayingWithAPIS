const DoorDashClient = require('@doordash/sdk');
const accessKey = require('./accesskey.js');

/* Get the status of a DoorDash order. */
async function getOrderStatus(orderId) {
    const client = new DoorDashClient.DoorDashClient(accessKey);

    try {
        const response = await client.getDelivery(orderId);
        console.log("RES", response.data);
        return response.data;
    } catch (error) {
        console.log("ERR", error);
        throw new Error('Error fetching order status: ' + error.message);
    }
}

module.exports = getOrderStatus;