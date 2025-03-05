// Format the status for display
const formatStatus = (status: string) =>
  status === "todo"
    ? "To Do"
    : status === "in-progress"
    ? "In Progress"
    : status === "completed"
    ? "Completed"
    : status;

export { formatStatus };
