import axios from 'axios';

/**
* Gets the NFC-e page based on a URL.
* 
* @param {String} url The NFC-e URL.
* @returns The NFC-e page.
*/
const getPage = async (url) => {
    const response = await axios.get(url);
    return response.data;
};

export { getPage };