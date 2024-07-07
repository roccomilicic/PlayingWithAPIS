const puppeteer = require('puppeteer');

async function getStoreInfo() {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

        await page.goto("https://www.doordash.com/store/mcdonald's-auckland-25103182/?cursor=eyJzdG9yZV9wcmltYXJ5X3ZlcnRpY2FsX2lkcyI6WzFdfQ==&pickup=false", {
            waitUntil: 'networkidle2'
        });

        const metaDescription = await page.$eval('meta[name="description"]', element => element.getAttribute('content'));
        console.log("GET STORE INFO: Meta Description:\n", metaDescription);

        const addressMatch = metaDescription.match(/from McDonald's at (.*?) in/);
        if (addressMatch) {
            const address = addressMatch[1].replace(' in ', ', ');
            console.log('Address:', address);
            return address;
        } else {
            throw new Error('Address not found in meta description');
        }
    } catch (error) {
        console.error(`Error getting store info for ID 25103182: ${error.message}`);
        throw new Error(`Error getting store info for ID 25103182: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = getStoreInfo;

// Test the function
(async () => {
    try {
        const address = await getStoreInfo();
        console.log('Store Address:', address);
    } catch (error) {
        console.error(error.message);
    }
})();
