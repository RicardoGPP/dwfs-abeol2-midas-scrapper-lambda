import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

/**
 * The SNS client.
 */
const client = new SNSClient({ region: 'us-east-1' });

/**
 * Creates a SNS publish input with a given message.
 * 
 * @param {Object} message The message to be published.
 * @returns A SNS publish input.
 */
const toInput = (message) => {
    return {
        Message: JSON.stringify(message),
        TopicArn: 'arn:aws:sns:us-east-1:590183686355:SaveDataSNS.fifo',
        MessageGroupId: 'SaveDataSNS',
        MessageDeduplicationId: new Date().getTime().toString()
    };
};

/**
 * Creates a SNS publish command with a given message.
 * 
 * @param {Object} message The message to be published.
 * @returns A SNS publish command.
 */
const toCommand = (message) => new PublishCommand(toInput(message));

/**
 * Publishes a message in the 'SaveData' SNS topic.
 * 
 * @param {Object} message The message to be published.
 */
export const publish = async (message) => await client.send(toCommand(message));