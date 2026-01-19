import { generateMessageContent } from "./generateMessageContent";

export interface Content {
  permalink: string;
  author: string;
  title: string;
  selftext: string;
  url: string;
  created: any;
}

export const generateIndividualMessage = (content: Content, channel: any) => {
  return channel.send(generateMessageContent(content));
};
