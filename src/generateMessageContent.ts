export const generateMessageContent = ({
  permalink,
  author,
  title,
  selftext,
  url,
}) => {
  // Maximum length for a Discord message is 2000 characters. Setting a buffer.
  const leftoverLength =
    1950 - (permalink.length + author.length + title.length);

  return `**Title:** ${title}
**Author:** ${author}** | Link:** [Link](${permalink})
${selftext ? selftext.substring(0, leftoverLength) + "..." : url}`;
};
