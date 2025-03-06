// Format the date for display

import { formatDistanceToNow } from "date-fns";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatDate = (date: any) => {
  if (!date) return "No date";

  // Convert Firestore Timestamp to Date if needed
  const dateObj = date.toDate ? date.toDate() : new Date(date);

  try {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

function getLocalDatetime(date: Date) {
  // Get the local date and time components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export { formatDate, getLocalDatetime };
