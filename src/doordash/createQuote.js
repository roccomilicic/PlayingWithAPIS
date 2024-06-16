const axios = require('axios');
const DoorDashClient = require('@doordash/sdk');
const accessKey = require('./accesskey.js');
const { uuid } = require('uuidv4');

async function createQuote(token, { pickupAddress, pickupPhoneNumber, dropoffAddress, dropoffPhoneNumber, orderValue }) {
    const client = new DoorDashClient.DoorDashClient(accessKey);
    
    try {
        const response = await client.deliveryQuote({
            external_delivery_id: uuid(),
            pickup_address: pickupAddress,
            dropoff_address: dropoffAddress,
            dropoff_phone_number: '+62288513174',
        });
        console.log("Response for acceptQuote:\n", response.message);
        return response.data;
    } catch (error) {
        throw new Error('\nError accepting delivery: ' + error.message);
    }
}

module.exports = createQuote;
