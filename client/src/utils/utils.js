export function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

export const capitalizeText = (text) => {
  if (text.length > 1) {
    const modifiedText = text.slice(0, -1); // Remove the last character
    return (
      modifiedText.charAt(0).toUpperCase() + modifiedText.slice(1).toLowerCase()
    );
  }
  return text.toUpperCase();
};
