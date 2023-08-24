const puppeteer = require('puppeteer');
const express = require('express');

const app = express();
const port = 3000;

// http://localhost:3000/scrape?username=TUO-USERNAME&password=TUA-PASSWORD richiesta http per login e scrape


// Variabili globali
let iliad_login_link = 'https://www.iliad.it/account/';
let xpathCredito = '//*[@id="container"]/div/div/div[2]/div[2]/div/div/div/h2/b';
let xpathIdUser = '//*[@id="account-login"]/div[1]/div[2]/div/div[4]/div[1]/form/div[1]/label[1]/input';
let xpathPassword = '//*[@id="account-login"]/div[1]/div[2]/div/div[4]/div[1]/form/div[1]/label[2]/input';
let xpathAccediButton = '//*[@id="account-login"]/div[1]/div[2]/div/div[4]/div[1]/form/div[2]/button';
let xpathTipoOfferta = '//*[@id="container"]/div/div/div[2]/div[2]/div/div/div/h2/span';
let xpathRecuperaPassword = '//*[@id="account-login"]/div[1]/div[2]/div/div[4]/div[1]/form/div[3]/a';
let xpathMinutiChiamata = '//*[@id="container"]/div/div/div[2]/div[2]/div/div/div/div[3]/div[1]/div[1]/div/div[1]/span[1]';
let xpathGbConsumati = '//*[@id="container"]/div/div/div[2]/div[2]/div/div/div/div[3]/div[2]/div[1]/div/div[1]/span[1]';
let xpathMessaggiInviati = '//*[@id="container"]/div/div/div[2]/div[2]/div/div/div/div[3]/div[1]/div[2]/div/div[1]/span[1]';
let xpathMMSInviati = '//*[@id="container"]/div/div/div[2]/div[2]/div/div/div/div[3]/div[2]/div[2]/div/div[1]/span[1]';
let xpathRinnovo = '//*[@id="container"]/div/div/div[2]/div[2]/div/div/div/div[2]';

// Funzione per effettuare il login
async function login(page, username, password) {
    try {
        await page.goto(iliad_login_link);

        await page.waitForXPath(xpathIdUser);
        const idInput = await page.$x(xpathIdUser);
        await idInput[0].type(username);

        await page.waitForXPath(xpathPassword);
        const passwordInput = await page.$x(xpathPassword);
        await passwordInput[0].type(password);

        await page.waitForXPath(xpathAccediButton);
        const loginButton = await page.$x(xpathAccediButton);
        await loginButton[0].click();

        
        await page.waitForNavigation();

        console.log('Login successful');

    } catch (error) {
        console.error('An error occurred during login:', error);
        throw error; // Rilancia l'errore per gestirlo nel chiamante
    }
}

// Funzione per ottenere i dati di scraping
async function scrapeData(username, password) {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();

    try {
        await login(page, username, password)

        // Wait for the element identified by xpathCredito
        await page.waitForXPath(xpathCredito);

        //offerta
        const tipoOffertaElement = await page.$x(xpathTipoOfferta);
        const offertaText = await page.evaluate(element => element.textContent, tipoOffertaElement[0]);
        //console.log('Offerta:', offertaText);

        //rinnovo
        const rinnovoElement = await page.$x(xpathRinnovo);
        const rinnovoText = await page.evaluate(element => element.textContent, rinnovoElement[0])
        const rinnovoTextTrimmed = rinnovoText.trim();
        //console.log('Rinnovo:', rinnovoTextTrimmed);

        //credito
        const creditoElement = await page.$x(xpathCredito);
        const creditoText = await page.evaluate(element => element.textContent, creditoElement[0]);
        //console.log('Credito:', creditoText);

        //minuti
        const minutiElement = await page.$x(xpathMinutiChiamata);
        const minutiText = await page.evaluate(element => element.textContent, minutiElement[0]);
        //console.log('Minuti:', minutiText);

        //gb
        const gbElement = await page.$x(xpathGbConsumati);
        const gbText = await page.evaluate(element => element.textContent, gbElement[0]);
        //console.log('Gb:', gbText);

        //messaggi
        const messaggiElement = await page.$x(xpathMessaggiInviati);
        const messaggiText = await page.evaluate(element => element.textContent, messaggiElement[0]);
        //console.log('Messaggi:', messaggiText);

        //mms
        const mmsElement = await page.$x(xpathMMSInviati);
        const mmsText = await page.evaluate(element => element.textContent, mmsElement[0]);
        //console.log('MMS:', mmsText);

        // Creazione dell'oggetto con i dati
        const scrapedData = {
            offerta: offertaText,
            rinnovo: rinnovoTextTrimmed,
            credito: creditoText,
            minuti: minutiText,
            gigabyte_usati: gbText,
            messaggi: messaggiText,
            mms: mmsText,
            // ... altre proprietà ...
        };

        // Converti l'oggetto in formato JSON
        const jsonData = JSON.stringify(scrapedData, null, 2);

        // Stampa il JSON sulla console
        console.log(jsonData);

        return scrapedData;
    } catch (error) {
        throw error;
    } finally {
        await browser.close();
    }
}




app.get('/scrape', async (req, res) => {
    const { username, password } = req.query;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const data = await scrapeData(username, password);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});