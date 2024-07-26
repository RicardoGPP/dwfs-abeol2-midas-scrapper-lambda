import axios from 'axios';

/**
 * Service for NFC-e.
 */
export default class NfceService {

    /**
    * Gets the NFC-e page based on a URL.
    * 
    * @param {String} url The NFC-e URL.
    * @returns The NFC-e page.
    */
    static async getPage(url) {
        const response = await axios.get(url);
        return response.data;
    }
}