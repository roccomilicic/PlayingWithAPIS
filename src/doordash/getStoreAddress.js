const puppeteer = require('puppeteer');

async function getAddress(url) {
    const browser = await puppeteer.launch({ headless: false }); // Launch browser in non-headless mode
    const page = await browser.newPage();

    try {
        // Navigate to the DoorDash restaurant page
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        // Wait for the address section to load
        await page.waitForSelector('.StackChildren__StyledStackChildren-sc-5x3aej-0.cQCjJJ', { visible: true, timeout: 60000 });

        // Extract the address text
        const address = await page.evaluate(() => {
            const streetAddressElement = document.querySelector('.StackChildren__StyledStackChildren-sc-5x3aej-0.cQCjJJ .Text-sc-16fu6d-0.hNVOUs');
            const cityElement = document.querySelector('.StackChildren__StyledStackChildren-sc-5x3aej-0.cQCjJJ .Text-sc-16fu6d-0.kVKROG');
            
            if (streetAddressElement && cityElement) {
                const streetAddress = streetAddressElement.textContent.trim();
                const city = cityElement.textContent.trim();
                return `${streetAddress}, ${city}`;
            } else {
                throw new Error('Address elements not found');
            }
        });

        console.log(`Address: ${address}`);

        // Log success message
        console.log('Address extracted successfully.');
    } catch (error) {
        console.error(`Failed to extract address. Error: ${error.message}`);
    } finally {
        // Close the browser
        await browser.close();
    }
}

// Example usage
const url = 'https://www.doordash.com/store/freaky-burger-and-tacos-auckland-25786028/?event_type=autocomplete&pickup=false';
getAddress(url);
