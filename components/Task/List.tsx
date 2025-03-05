// ./components/Task/List.tsx

"use client";

import { auth } from "@/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { TaskWithRelation } from "@/types";
import Loader from "@/components/Loader";
import TaskItem from "@/components/Task/Item";
import getUserOrgTasksRealtime from "@/utils/firebase/task/getUserTasks";

const TaskList = ({ userOrgId }: { userOrgId: string }) => {
  const [user] = useAuthState(auth);
  const [tasks, setTasks] = useState<TaskWithRelation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !userOrgId) return;

    setLoading(true);

    // Set up the real-time listener
    const unsubscribe = getUserOrgTasksRealtime(
      user.uid,
      userOrgId,
      (updatedTasks) => {
        setTasks(updatedTasks);
        setLoading(false);
      }
    );

    // Clean up listener when component unmounts
    return () => unsubscribe();
  }, [user, userOrgId]);

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <div className="flex items-center justify-center h-full py-12">
          <Loader loading={loading} className="h-8 w-8" />
        </div>
      ) : tasks.length > 0 ? (
        <ul className="flex flex-col gap-6">
          {tasks.map((task) => (
            <li key={task.id} className="flex-1">
              <TaskItem task={task} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center flex-col gap-1 justify-center h-full py-12">
          <p>No tasks found</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
