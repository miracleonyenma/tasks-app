// ./components/Task/Item.tsx

import { useState } from "react";
import { TaskItemProps } from "@/types";
import VaulDrawer from "../Drawer";
import { toast } from "sonner";
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import TaskForm from "@/components/Task/Form";
import Loader from "@/components/Loader";
import { formatDate } from "@/utils";
import { formatStatus } from "@/utils/task";

const TaskItem = ({ task }: TaskItemProps) => {
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update task status
  const updateTaskStatus = async (newStatus: string) => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        status: newStatus,
        updatedAt: new Date(),
      });
      toast.success(`Task marked as ${formatStatus(newStatus)}`);
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };

  // Delete task
  const deleteTask = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        setIsDeleting(true);
        const taskRef = doc(db, "tasks", task.id);
        await deleteDoc(taskRef);
        toast.success("Task deleted successfully");
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="card">
      {/* Task Header with Priority and Status Badges */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 leading-tight truncate">
            {task.name}
          </h3>

          <div className="flex flex-wrap items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
            <span>
              {task.relation === "created"
                ? "Created by you"
                : task.assigneeName
                ? `Assigned to ${task.assigneeName}`
                : "Assigned to you"}
            </span>
            •<span>Due {formatDate(task.dueDate)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <span
            className={`tag sm  capitalize ${
              task.priority === "low"
                ? "success"
                : task.priority === "medium"
                ? "warning"
                : "danger"
            }`}
          >
            {task.priority}
          </span>
          <span
            className={`tag sm  ${
              task.status === "completed"
                ? "success"
                : task.status === "in-progress"
                ? "warning"
                : "danger"
            }`}
          >
            {formatStatus(task.status)}
          </span>
        </div>
      </div>

      {/* Task Description */}
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
          {task.description}
        </p>
      </div>

      {/* Task Actions */}
      <div className="flex flex-wrap gap-2">
        {/* Status Update Actions */}
        <div className=" btn-group">
          {task.status !== "todo" && (
            <button onClick={() => updateTaskStatus("todo")} className="btn sm">
              To Do
            </button>
          )}
          {task.status !== "in-progress" && (
            <button
              onClick={() => updateTaskStatus("in-progress")}
              className="btn sm secondary"
            >
              In Progress
            </button>
          )}
          {task.status !== "completed" && (
            <button
              onClick={() => updateTaskStatus("completed")}
              className="btn sm primary"
            >
              Complete
            </button>
          )}
        </div>

        {/* Edit & Delete Actions */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setIsUpdateDrawerOpen(true)}
            className="btn sm"
          >
            Edit
          </button>
          <button
            onClick={deleteTask}
            disabled={isDeleting}
            className="btn sm danger"
          >
            {isDeleting ? (
              <Loader loading={isDeleting} className="h-4 w-4" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>

      {/* Update Task Drawer */}
      <VaulDrawer
        open={isUpdateDrawerOpen}
        onOpenChange={setIsUpdateDrawerOpen}
        title="Update Task"
      >
        <TaskForm
          mode="edit"
          task={task}
          userOrgId={task.orgId}
          onSuccess={() => setIsUpdateDrawerOpen(false)}
          onClose={() => setIsUpdateDrawerOpen(false)}
        />
      </VaulDrawer>
    </div>
  );
};

export default TaskItem;
