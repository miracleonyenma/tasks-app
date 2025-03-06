// utils/firebase/task/getUserOrgTasks.ts
import { db } from "@/firebase";
import { TaskData, TaskWithRelation } from "@/types";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

/**
 * Gets tasks created by or assigned to a user within a specific organization in realtime
 */
const getUserOrgTasksRealtime = (
  userId: string,
  orgId: string,
  callback: (tasks: TaskWithRelation[]) => void
) => {
  if (!userId || !orgId) return () => {};

  // Query for tasks in the specified org that involve this user
  const tasksQuery = query(
    collection(db, "tasks"),
    where("orgId", "==", orgId),
    where("participants", "array-contains", userId)
  );

  // Set up real-time listener
  const unsubscribe = onSnapshot(
    tasksQuery,
    (snapshot) => {
      const tasks = snapshot.docs.map((doc) => {
        const data = doc.data();

        // Determine relationship to task
        const relation = data.createdBy === userId ? "created" : "assigned";

        // Convert timestamps to Date objects for consistency
        const taskWithDates: TaskWithRelation = {
          // id:  doc.id,
          ...(data as TaskData),
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : data.createdAt,
          updatedAt:
            data.updatedAt instanceof Timestamp
              ? data.updatedAt.toDate()
              : data.updatedAt,
          dueDate:
            data.dueDate instanceof Timestamp
              ? data.dueDate.toDate()
              : data.dueDate,
          relation,
        };

        return taskWithDates;
      });

      callback(tasks);
    },
    (error) => {
      console.error("Error fetching tasks:", error);
      callback([]);
    }
  );

  return unsubscribe;
};

export default getUserOrgTasksRealtime;
