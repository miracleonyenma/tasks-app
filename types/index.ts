// ./types/index.ts

import { FieldValue, Timestamp } from "firebase/firestore";

// Represents the input structure for updating a task.
export interface TaskUpdateInput {
  taskId: string; // Unique identifier for the task
  name?: string; // Updated task name (optional)
  description?: string; // Updated task description (optional)
  dueDate?: Date | FieldValue; // Updated due date, can be a Date or Firestore FieldValue
  priority?: string; // Updated priority level (optional)
  status?: string; // Updated task status (e.g., "open", "in-progress", "completed")
  assignedTo?: string; // User ID of the new assignee (optional)
  updatedBy: string; // ID of the user performing the update
}

// Represents a task entity stored in Firestore.
export interface FirestoreTask {
  orgId: string; // Organization ID the task belongs to
  name: string; // Task title
  description: string; // Task details
  dueDate: Date | FieldValue; // Due date, stored as a Firestore timestamp or Date
  priority: string; // Task priority (e.g., "low", "medium", "high")
  status: string; // Task status
  assignedTo: string; // User ID of the assigned person
  createdBy: string; // User ID of the creator
  participants: string[]; // List of user IDs involved in the task
  createdAt: Date | FieldValue; // Timestamp of task creation
  updatedAt: Date | FieldValue; // Timestamp of last update
}

// Represents the input structure for creating a new task.
export interface TaskInput {
  orgId: string; // Organization ID the task belongs to
  name: string; // Task name
  description: string; // Task description
  dueDate: Date | FieldValue; // Task due date
  priority: string; // Task priority level
  status: string; // Task status
  assignedTo: string; // ID of the assigned user
  createdBy: string; // ID of the user who created the task
}

// Represents an organization entity stored in Firestore.
export interface FirestoreOrg {
  name: string; // Organization name
  createdAt: Date | FieldValue; // Timestamp of organization creation
  updatedAt: Date | FieldValue; // Timestamp of last update
  members?: FirestoreMembership[]; // Optional list of members in the organization
}

// Represents a user entity stored in Firestore.
export interface FirestoreUser {
  displayName: string | null; // User's display name (nullable)
  email: string | null; // User's email (nullable)
  photoURL: string | null; // URL to the user's profile photo (nullable)
  uid: string; // Unique user ID
  createdAt: Timestamp | FieldValue; // Account creation timestamp
  lastLoginAt: Timestamp | FieldValue; // Timestamp of the last login
}

// Represents a membership entity that links a user to an organization.
export interface FirestoreMembership {
  orgId: string; // Organization ID the user belongs to
  userId: string; // User ID
  status?: string; // Membership status (e.g., "invited", "active", "suspended")
  invitedBy: string; // User ID of the person who invited this user
  invitedAt: Timestamp | FieldValue; // Timestamp of invitation
  joinedAt: Timestamp | FieldValue | null; // Timestamp of when the user joined (nullable)
  lastActiveAt: Timestamp | FieldValue | null; // Timestamp of last activity (nullable)
}

// Represents the input structure for adding a user to an organization.
export interface MembershipInput {
  orgId: string; // Organization ID
  userId: string; // User ID
  status?: string; // Membership status (e.g., "invited", "active", "suspended")
  invitedBy: string; // User ID of the inviter
}

// Represents a structured task entity with more flexible types.
export interface TaskData {
  orgId: string; // Organization ID
  id: string; // Unique task ID
  createdBy: string; // User ID of the task creator
  assignedTo: string; // User ID of the assignee
  name: string; // Task title
  description: string; // Task details
  status: string; // Task status
  priority: string; // Task priority level
  dueDate?: Timestamp | Date; // Due date (optional)
  createdAt?: Timestamp | Date; // Creation timestamp (optional)
  updatedAt?: Timestamp | Date; // Last update timestamp (optional)
  [key: string]: unknown; // Allows additional unknown properties for flexibility
}

// Represents a task with an explicit user relation.
export interface TaskWithRelation extends TaskData {
  relation: "created" | "assigned"; // Relationship of the user to the task
}

// Represents the input structure for fetching user tasks.
export interface GetUserTasksInput {
  userId: string; // User ID whose tasks are being fetched
  includeCreated?: boolean; // Whether to include tasks created by the user
  includeAssigned?: boolean; // Whether to include tasks assigned to the user
  status?: string | string[]; // Optional filter for task status
  limit?: number; // Optional limit on number of results
}

// Represents the result structure for fetching user tasks.
export interface GetUserTasksResult {
  success: boolean; // Indicates if the request was successful
  message: string; // Response message
  tasks: TaskWithRelation[]; // List of tasks matching the criteria
  error?: string; // Optional error message
}

// Represents the props for a task form component.
export interface TaskFormProps {
  task?: TaskWithRelation; // Existing task for editing (optional)
  userOrgId: string; // Organization ID of the user
  onClose?: () => void; // Callback function when the form is closed
  onSuccess?: () => void; // Callback function when the task operation succeeds
  mode: "create" | "edit"; // Mode of the form (creating or editing a task)
}

// Represents the props for displaying a single task item.
export interface TaskItemProps {
  task: TaskWithRelation; // Task data to be displayed
}
