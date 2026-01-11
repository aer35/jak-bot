import { generateMessageContent } from './generateMessageContent';

export const generateIndividualMessage = (content, channel) => {
	return channel.send(generateMessageContent(content));
};
