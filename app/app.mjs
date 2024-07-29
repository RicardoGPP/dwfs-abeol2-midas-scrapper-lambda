import { scrape } from './src/core/scrapper.mjs';
import { publish } from './src/publisher/sns-publisher.mjs';

/**
 * Handles a scrape event.
 * 
 * @param {Object} event The event to be handled.
 * @returns A HTTP-prepared response.
 */
const lambdaHandler = async (event) => {
    for (const record of event.Records) {
        const body = JSON.parse(record.body);
        const url = body.Message;
        const message = await scrape(url);
        await publish(message);
    }
};

export { lambdaHandler };