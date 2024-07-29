import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { AWS_ACCOUNT_ID, AWS_TOPIC, AWS_MESSAGE_GROUP_ID, AWS_REGION } from './../util/constants.mjs';

/**
 * The SNS client.
 */
const client = new SNSClient({ region: AWS_REGION });

/**
 * Publishes a message in the 'SaveData' SNS topic.
 * 
 * @param {Object} message The message to be published.
 */
const publish = async (message) => await client.send(toCommand(message));

/**
 * Creates a SNS publish command with a given message.
 * 
 * @param {Object} message The message to be published.
 * @returns A SNS publish command.
 */
const toCommand = (message) => new PublishCommand(toInput(message));

/**
 * Creates a SNS publish input with a given message.
 * 
 * @param {Object} message The message to be published.
 * @returns A SNS publish input.
 */
const toInput = (message) => {
    return {
        Message: JSON.stringify(message),
        TopicArn: `arn:aws:sns:${AWS_REGION}:${AWS_ACCOUNT_ID}:${AWS_TOPIC}`,
        MessageGroupId: AWS_MESSAGE_GROUP_ID,
        MessageDeduplicationId: new Date().getTime().toString()
    };
};

export { publish };