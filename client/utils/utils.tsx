export const highlightTokenInSentence = (sentence: string, token: string) => {
  const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(\\b${escapedToken}\\b)`, 'gi');
  const parts = sentence.split(regex);   
  return parts.map((part, index) =>
    part.toLowerCase() === token.toLowerCase() ? (
      <span key={index} className="bg-blue-200">{part}</span>
    ) : (
      part
    )
  );
};