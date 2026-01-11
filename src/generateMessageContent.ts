export const generateMessageContent = ({
  permalink,
  author,
  title,
  selftext,
  url,
  created,
}) => {
  // Maximum length for a Discord message is 2000 characters. Setting an arbitrary buffer to prevent losing part of a message due to unforeseen characters.
  const maxMsgLengthWithBuffer = 1950;
  const leftoverLength =
    maxMsgLengthWithBuffer - (permalink.length + author.length + title.length);

  const convertedDate = new Date().toLocaleDateString("en-US", created);

  return `**Title:** ${title}
**Author:** ${author} | **Posted:** ${convertedDate} | [Link](https://reddit.com${permalink})
${selftext ? selftext.substring(0, leftoverLength) + "..." : url}`;
};
