import axios from 'axios';

/**
 * Service for geolocalization.
 */
export default class GeolocalizationService {

    /**
     * Gets the latitude and longitude from a zip code.
     * 
     * @param {String} zipCode The zip code.
     * @returns An object containing the latitude and longitude.
     */
    static async getLatLng(zipCode) {
        const response = await axios.get(`https://cep.awesomeapi.com.br/json/${zipCode}`);

        const { lat, lng } = response.data;

        return {
            latitude: lat,
            longitude: lng
        };
    }
};