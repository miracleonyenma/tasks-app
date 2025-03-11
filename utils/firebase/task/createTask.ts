// ./utils/firebase/task/createTask.ts

import { db } from "@/firebase";
import { TaskData, TaskInput } from "@/types";
import { doc, setDoc, serverTimestamp, collection } from "firebase/firestore";

/**
 * Creates a new task in Firestore
 * @param taskInput - Task input data
 * @returns Promise with result message and success status
 */
const createTask = async (taskInput: TaskInput) => {
  try {
    // check if user has permission to create task
    const check = await (
      await fetch("/api/permit/check", {
        method: "POST",
        body: JSON.stringify({
          user: taskInput.createdBy,
          action: "create",
          resource: "Task",
        }),
      })
    ).json();

    if (!check) throw new Error("User does not have permission to create task");

    // Guard clause for missing required data
    if (
      !taskInput?.name ||
      !taskInput?.description ||
      !taskInput?.createdBy ||
      !taskInput?.assignedTo ||
      !taskInput?.orgId
    ) {
      console.error("Invalid task data provided");
      return {
        success: false,
        message: "Invalid task data",
      };
    }

    // Create a new document reference with auto-generated ID
    const taskRef = doc(collection(db, "tasks"));

    // Create participants array for efficient querying
    const participants = [taskInput.createdBy];
    if (taskInput.assignedTo !== taskInput.createdBy) {
      participants.push(taskInput.assignedTo);
    }

    // Create the initial task data (without the fields that cause type errors)
    const taskData: TaskData = {
      id: taskRef.id,
      name: taskInput.name,
      description: taskInput.description,
      priority: taskInput.priority || "low",
      status: taskInput.status || "todo",
      assignedTo: taskInput.assignedTo,
      createdBy: taskInput.createdBy,
      orgId: taskInput.orgId,
      participants: participants, // Added for query efficiency
      // We'll handle timestamps separately due to type conflicts
    };

    // Handle the timestamp fields separately to avoid type conflicts
    const taskWithTimestamps = {
      ...taskData,
      dueDate: taskInput.dueDate || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Write to Firestore
    await setDoc(taskRef, taskWithTimestamps);
    console.log(`Task created successfully: ${taskInput.name}`);

    // create resorce instance for the task
    await fetch("/api/permit/create-resource-instance", {
      method: "POST",
      body: JSON.stringify({
        key: taskRef.id,
        resource: "Task",
        tenant: "default",
      }),
    });

    // assign role of task admin to the user
    await fetch("/api/permit/assign-role", {
      method: "POST",
      body: JSON.stringify({
        user: taskInput.createdBy,
        role: "admin",
        resource_type: "Task",
        resource_instance: taskRef.id,
      }),
    });

    // assign role of task assignee to the user
    await fetch("/api/permit/assign-role", {
      method: "POST",
      body: JSON.stringify({
        user: taskInput.assignedTo,
        role: "assignee",
        resource_type: "Task",
        resource_instance: taskRef.id,
      }),
    });

    // create relationship between task and org
    await fetch("/api/permit/create-relationship", {
      method: "POST",
      body: JSON.stringify({
        subject: `Organization:${taskInput.orgId}`,
        relation: "parent",
        object: `Task:${taskRef.id}`,
      }),
    });

    return {
      success: true,
      message: "Task created successfully",
      taskId: taskRef.id,
      task: { name: taskInput.name },
    };
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      success: false,
      message: "Failed to create task",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export default createTask;
