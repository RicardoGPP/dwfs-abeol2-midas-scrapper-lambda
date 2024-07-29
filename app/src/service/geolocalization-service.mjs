import axios from 'axios';
import fs from 'fs';

/**
 * Gets the latitude and longitude of an address.
 * 
 * @param {Object} address The address.
 * @returns An object containing the latitude and longitude.
 */
const getLatLng = async ({ zipCode, city, state }) => {
    try {
        return await getLatLngByZipCodeFromApi(zipCode);
    } catch (error) {
        console.error('Error getting latlng from API. Falling back to CSV...', error);
        return getLatLngByCityAndStateFromCsv(city, state);
    }
};

/**
 * Gets the latitude and longitude by zip code from a geolocalization API.
 * 
 * @param {String} zipCode The zip code.
 * @returns An object containing the latitude and longitude.
 */
const getLatLngByZipCodeFromApi = async (zipCode) => {
    const response = await axios.get(`https://cep.awesomeapi.com.br/json/${zipCode}`);

    const { lat, lng } = response.data;

    return {
        latitude: lat,
        longitude: lng
    };
};

/**
 * Gets the latitude and longitude by a city and state from a CSV file.
 * 
 * @param {String} city The city.
 * @param {String} state The state.
 * @returns An object containing the latitude and longitude.
 */
const getLatLngByCityAndStateFromCsv = (city, state) => {
    const csv = fs.readFileSync(`${process.cwd()}/src/resource/latlng.csv`, 'utf-8');

    const rows = csv.split('\n');

    city = normalize(city);
    state = normalize(state);

    for (let i = 0; i < rows.length; i++) {
        const columns = rows[i].split(';');

        const csvCity = normalize(columns[2]);
        const csvState = normalize(columns[1]);

        if (city !== csvCity || state !== csvState) {
            continue;
        }

        return {
            latitude: Number(columns[3]),
            longitude: Number(columns[4])
        };
    }

    throw new Error(`No latlng could be found for '${city}-${state}'.`);
};

/**
 * Normalizes a text by removing invalid characters and converting to uppercase.
 * 
 * @param {String} term The term to be normalized.
 * @returns The normalized term.
 */
const normalize = (term) => term
    .trim()
    .toUpperCase()
    .replace(/"/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export { getLatLng };