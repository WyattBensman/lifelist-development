import { formatDistanceToNow, format } from "date-fns";

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

export const capitalizeTextNoSlice = (text) => {
  if (text.length > 1) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
  return text.toUpperCase();
};

export const formatDate = (date) => {
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  if (new Date(date) < tenDaysAgo) {
    return format(new Date(date), "MM/dd/yyyy");
  } else {
    return `${formatDistanceToNow(new Date(date))} ago`;
  }
};
