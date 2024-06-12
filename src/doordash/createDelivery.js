const DoorDashClient = require('@doordash/sdk');
const token = require('../discordBot/config.json');
const accessKey = require('./accesskey.js');

async function createDelivery(token, externalDeliveryId) {
    const client = new DoorDashClient.DoorDashClient(accessKey);
    
    try {
        const response = await client.createDelivery({
            external_delivery_id: externalDeliveryId,
            pickup_address: '901 Market Street 6th Floor San Francisco, CA 94103',
            pickup_business_name: 'Wells Fargo SF Downtown',
            pickup_phone_number: '+16505555555',
            pickup_instructions: 'Enter gate code 1234 on the callbox.',
            dropoff_address: '901 Market Street 6th Floor San Francisco, CA 94103',
            dropoff_business_name: 'Wells Fargo SF Downtown',
            dropoff_phone_number: '+16505555555',
            dropoff_instructions: 'Enter gate code 1234 on the callbox.',
            order_value: 1999,
        });
        return response;
    } catch (error) {
        throw new Error('Error creating delivery: ' + error.message);
    }
}

module.exports = createDelivery;
