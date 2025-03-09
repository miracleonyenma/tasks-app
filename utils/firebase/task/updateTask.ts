// ./utils/firebase/task/updateTask.ts

import { db } from "@/firebase";
import { TaskUpdateInput } from "@/types";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";

/**
 * Updates an existing task in Firestore
 * @param taskUpdateInput - Task update data
 * @returns Promise with result message and success status
 */
const updateTask = async (taskUpdateInput: TaskUpdateInput) => {
  try {
    // Guard clause for missing essential data
    if (!taskUpdateInput?.taskId || !taskUpdateInput?.updatedBy) {
      console.error("Invalid update data provided");
      return {
        success: false,
        message: "Invalid update data",
      };
    }

    const { taskId, updatedBy, ...updateFields } = taskUpdateInput;
    const taskRef = doc(db, "tasks", taskId);

    // Check if task exists in Firestore
    const taskSnap = await getDoc(taskRef);

    if (!taskSnap.exists()) {
      console.error(`Task not found: ${taskId}`);
      return {
        success: false,
        message: "Task not found",
      };
    }

    // Prepare update data with timestamp
    const updateData = {
      ...updateFields,
      updatedAt: serverTimestamp(),
      lastUpdatedBy: updatedBy,
    };

    // Remove undefined fields to avoid overwriting with undefined
    Object.keys(updateData).forEach((key) => {
      if (
        key in updateData &&
        updateData[key as keyof typeof updateData] === undefined
      ) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    // Only update if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        message: "No fields to update",
      };
    }

    await updateDoc(taskRef, updateData);
    console.log(`Task updated successfully: ${taskId}`);

    // assign role of task assignee to the user
    await fetch("/api/permit/assign-role", {
      method: "POST",
      body: JSON.stringify({
        user: taskUpdateInput.assignedTo,
        role: "assignee",
        resource_type: "Task",
        resource_instance: taskRef.id,
      }),
    });

    return {
      success: true,
      message: "Task updated successfully",
      task: { id: taskId },
    };
  } catch (error) {
    console.error("Error updating task:", error);
    return {
      success: false,
      message: "Failed to update task",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export default updateTask;
