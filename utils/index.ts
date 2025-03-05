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

export { formatDate };
