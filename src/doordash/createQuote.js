const axios = require('axios');
const accessKey = require('./accesskey.js');
const { uuid } = require('uuidv4');

async function createQuote(token, { pickupAddress, pickupPhoneNumber, dropoffAddress, dropoffPhoneNumber, orderValue }) {
    const url = 'https://openapi.doordash.com/drive/v2/quotes';

    const data = {
        external_delivery_id: uuid(),
        pickup_address: pickupAddress,
        dropoff_address: dropoffAddress,
        dropoff_phone_number: '+62288513174',
    };

    const headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
    };

    try {
        const response = await axios.post(url, data, { headers });
        console.log("Response for quote:\n", response.data);
        return response.data;
    } catch (error) {
        throw new Error('Error creating quote: ' + error.field_errors);
    }
}

module.exports = createQuote;
