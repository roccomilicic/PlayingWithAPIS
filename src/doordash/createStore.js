const https = require('https');
const accessKey = require('./accesskey.js');

async function createStore(businessId, storeName, address) {
  const url = `https://developer.doordash.com/v1/businesses/${businessId}/stores`;
  const data = JSON.stringify({
    external_store_id: "your_unique_store_id", // Replace with a unique identifier
    name: storeName,
    address: address,
  });

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessKey}`,
      'Content-Type': 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => (responseBody += chunk.toString()));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(responseBody));
        } else {
          reject(new Error(`Error creating store: ${res.statusCode} - ${responseBody}`));
        }
      });
    });

    req.on('error', (error) => reject(error));
    req.write(data);
    req.end();
  });
}

// Function to extract store name from a URL
function extractStoreName(url) {
  const parts = url.split('/');
  // Check if 'store' exists in the URL path
  if (parts.indexOf('store') !== -1) {
    return parts[parts.indexOf('store') + 1];
  } else {
    // Handle case where 'store' is not found
    console.warn("WARNING: Store name not found in URL format");
    return "";
  }
}

(async () => {
  // Business ID (replace with your actual ID)
  const businessId = '12979703';

  // Extract store name from the given URL
  const storeUrl = 'https://www.doordash.com/store/mcdonald\'s-auckland-25103182/?cursor=eyJzdG9yZV9wcmltYXJ5X3ZlcnRpY2FsX2lkcyI6WzFdfQ==&pickup=false';
  const storeName = extractStoreName(storeUrl);

  // Get store address (replace with your logic to get the store address)
  const storeAddress = '// Replace with logic to get store address';

  try {
    const response = await createStore(businessId, storeName, storeAddress);
    console.log("STORE: Response for createStore:", response);
  } catch (error) {
    console.error("Error creating store:", error);
  }
})();

module.exports = createStore;
