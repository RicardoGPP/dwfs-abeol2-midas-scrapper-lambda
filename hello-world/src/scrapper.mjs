import GeolocalizationService from './../service/geolocalization-service.mjs';
import NfceService from './../service/nfce-service.mjs';
import * as cheerio from 'cheerio';

/**
 * Clears the text by removing extra spaces.
 * 
 * @param {String} text The text to be cleaned.
 * @returns The cleaned text.
 */
const clear = (text) => text?.replace(/\s+/g, ' ').trim();

/**
 * Converts a text into a number value.
 * 
 * @param {String} text The text to be converted.
 * @returns The converted number value.
 */
const toNumber = (text) => parseFloat(text.replace(/[^0-9,.-]+/g, '').replace(',', '.'));

/**
 * Gets the supermarket data.
 * 
 * @param {Object} $ The cheerio page object.
 * @returns The supermarket data.
 */
const getSupermarket = ($) => {
    const companyName = clear($('th.text-uppercase b').text());
    const cnpjText = clear($('td').filter((_, el) => $(el).text().includes('CNPJ')).text());
    const cnpj = clear(cnpjText.split('CNPJ:')[1].split(',')[0]);

    return { companyName, cnpj };
};

/**
 * Gets the supermarket address data.
 * 
 * @param {Object} $ The cheerio page object.
 * @returns The supermarket address data.
 */
const getAddress = async ($) => {
    const terms = clear($('td[style*="italic"]').text()).split(',');

    const street = clear(terms[0]);
    const number = clear(terms[1]);
    const neighborhood = clear(terms[2]);
    const zipCode = clear(terms[3].split(' ')[1]);
    const city = clear(terms[3].split('-')[1]);
    const state = clear(terms[4].split('-')[0]);

    let latlng = {};

    try {
        latlng = await GeolocalizationService.getLatLng(zipCode);
    } catch (error) {
        console.error(error);
    }

    return {
        street,
        number,
        neighborhood,
        zipCode,
        city,
        state,
        ...latlng
    };
};

/**
 * Gets the products data.
 * 
 * @param {Object} $ The cheerio page object.
 * @returns The products data.
 */
const getProducts = ($) => {
    const products = [];

    $('#myTable tr').each((_, row) => {
        const column = $(row).find('td');

        const name = clear($(column[0]).find('h7').text());
        const code = clear($(column[0]).text().split('Código: ')[1]).replace(')', '');
        const quantity = toNumber(clear($(column[1]).text().split(': ')[1]));
        const unit = clear($(column[2]).text().split(': ')[1]);
        const price = toNumber(clear($(column[3]).text().split(': ')[1]));

        const product = {
            product: name,
            code,
            quantity,
            unit,
            price
        };

        if (unit === 'KG' && quantity > 0) {
            product.pricePerKg = parseFloat((price / quantity).toFixed(2));
        }

        products.push(product);
    });

    return products;
};

/**
 * Scrapes the supermarket, product and price data from a NFC-e URL.
 * 
 * @param {String} url The NFC-e URL to be scraped.
 * @returns An object with the scraped data.
 */
export const scrape = async (url) => {
    try {
        const page = await NfceService.getPage(url);
        const $ = cheerio.load(page);

        const supermarket = getSupermarket($);
        const address = await getAddress($);
        const products = getProducts($);

        return {
            ...supermarket,
            address,
            products
        };
    } catch (error) {
        console.error(error);
    }
};