const axios = require('axios');
const accessKey = require('./accesskey.js');

async function createQuote(token, { externalDeliveryId, pickupAddress, pickupPhoneNumber, dropoffAddress, dropoffPhoneNumber, orderValue }) {
    const url = 'https://openapi.doordash.com/drive/v2/quotes';

    const data = {
        external_delivery_id: externalDeliveryId,
        pickup_address: pickupAddress,
        dropoff_address: dropoffAddress,
        dropoff_phone_number: '+62288513174',
        //order_value: orderValue,
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
