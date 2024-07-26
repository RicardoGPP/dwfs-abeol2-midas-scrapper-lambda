import { scrape } from './src/scrapper.mjs';
import { publish } from './src/sns-publisher.mjs';

/**
 * Handles a scrape event.
 * 
 * @param {Object} event The event to be handled.
 * @returns A HTTP-prepared response.
 */
export const lambdaHandler = async (event) => {
    for (const record of event.Records) {
        const body = JSON.parse(record.body);
        const url = body.Message;
        const message = await scrape(url);
        await publish(message);
    }
};