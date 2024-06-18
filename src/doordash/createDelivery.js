const DoorDashClient = require('@doordash/sdk');
const accessKey = require('./accesskey.js');
const { uuid } = require('uuidv4');

async function createDelivery() {
    const client = new DoorDashClient.DoorDashClient(accessKey);
    
    try {
        const response = await client.createDelivery({
            external_delivery_id: uuid(),
            pickup_address: '329 Albany Highway, Rosedale, 0632 Auckland, New Zealand',
            pickup_phone_number: '+642885133222',
            dropoff_address: '80 Laurel Oak Drive, Schnapper Rock, 0632 Auckland, New Zealand',
            dropoff_phone_number: '+642885131748',
        });
        console.log("Response for createDelivery:", response.data);
        return response.data;
    } catch (error) {
        throw new Error('Error creating delivery: ' + error.message);
    }
}

module.exports = createDelivery;
