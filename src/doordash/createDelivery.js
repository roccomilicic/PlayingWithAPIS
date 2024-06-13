const DoorDashClient = require('@doordash/sdk');
const accessKey = require('./accesskey.js');

async function createDelivery(externalDeliveryId) {
    const client = new DoorDashClient.DoorDashClient(accessKey);
    
    try {
        const response = await client.createDelivery({
            external_delivery_id: externalDeliveryId,
            pickup_address: '901 Market Street 6th Floor San Francisco, CA 94103',
            pickup_phone_number: '+16505555555',
            dropoff_address: '901 Market Street 6th Floor San Francisco, CA 94103',
            dropoff_phone_number: '+16505555555',
            order_value: 1999,
        });
        return response.data;
    } catch (error) {
        throw new Error('Error creating delivery: ' + error.message);
    }
}

module.exports = createDelivery;
