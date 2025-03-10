// components/Task/Form.tsx

"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { auth } from "@/firebase";
import { TaskInput, TaskFormProps } from "@/types";
import Loader from "@/components/Loader";
import { Timestamp } from "firebase/firestore";
import createTask from "@/utils/firebase/task/createTask";
import getOrgMembersRealtime, {
  OrgMember,
} from "@/utils/firebase/org/getOrgMembers";
import { getLocalDatetime } from "@/utils";
import updateTask from "@/utils/firebase/task/updateTask";

const TaskForm = ({
  task,
  userOrgId,
  onClose,
  onSuccess,
  mode = "create",
}: TaskFormProps) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);

  const formik = useFormik({
    initialValues: {
      name: task?.name || "",
      description: task?.description || "",
      dueDate: getLocalDatetime(
        new Date(task?.dueDate?.toString() || "") || new Date()
      ),
      priority: task?.priority || "medium",
      status: task?.status || "todo",
      assignedTo: task?.assignedTo || "",
      orgId: userOrgId,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Task name is required")
        .min(3, "Must be at least 3 characters")
        .max(50, "Must be at most 50 characters"),
      description: Yup.string()
        .required("Description is required")
        .max(500, "Must be at most 500 characters"),
      dueDate: Yup.date()
        .required("Due date is required")
        .min(
          mode === "create" ? new Date() : undefined,
          "Due date must be in the future"
        ),
      priority: Yup.string().required("Priority is required"),
      status: Yup.string().required("Status is required"),
      assignedTo: Yup.string().required("Assignee is required"),
      orgId: Yup.string().required("Organization is required"),
    }),
    onSubmit: (values) => {
      if (user?.uid) {
        if (mode === "create") {
          handleCreateTask(values);
        } else if (mode === "edit" && task) {
          handleUpdateTask(values);
        }
      }
    },
  });

  const handleCreateTask = async (values: typeof formik.values) => {
    if (!user?.uid) return;

    const taskInput: TaskInput = {
      name: values.name,
      description: values.description,
      dueDate: Timestamp.fromDate(new Date(values.dueDate)),
      priority: values.priority,
      status: values.status,
      assignedTo: values.assignedTo,
      createdBy: user.uid,
      orgId: values.orgId,
    };

    toast.promise(createTask(taskInput), {
      loading: (() => {
        setLoading(true);
        return "Creating task...";
      })(),
      success: (data) => {
        if (!data.success) throw new Error(data.message);

        formik.resetForm();
        if (onSuccess) onSuccess();
        if (onClose) onClose();
        return "Task created successfully";
      },
      error: "Error creating task",
      finally: () => {
        setLoading(false);
        formik.setSubmitting(false);
      },
    });
  };

  const handleUpdateTask = async (values: typeof formik.values) => {
    if (!user?.uid || !task) return;

    setLoading(true);
    formik.setSubmitting(true);

    try {
      await updateTask({
        taskId: task.id,
        updatedBy: user.uid,
        name: values.name,
        description: values.description,
        dueDate: Timestamp.fromDate(new Date(values.dueDate)),
        priority: values.priority,
        status: values.status,
        assignedTo: values.assignedTo,
      });

      toast.success("Task updated successfully");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
      formik.setSubmitting(false);
    }
  };

  useEffect(() => {
    // Use our new utility function for org members
    const unsubscribe = getOrgMembersRealtime(
      formik.values.orgId,
      (members) => {
        setOrgMembers(members);
      }
    );

    // Cleanup on unmount
    return () => unsubscribe();
  }, [formik.values.orgId]);

  useEffect(() => {
    console.log({ task });
    console.log({ values: formik.values });
  }, [task, formik.values]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Task Name</label>
          <input
            type="text"
            placeholder="Implement login functionality"
            id="name"
            className="form-input"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="form-error">{formik.errors.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description">Description</label>
          <textarea
            placeholder="Describe the task details"
            id="description"
            className="form-input"
            rows={3}
            {...formik.getFieldProps("description")}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="form-error">{formik.errors.description}</p>
          )}
        </div>

        <div className="form-group flex flex-wrap gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              className="form-input"
              {...formik.getFieldProps("status")}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {formik.touched.status && formik.errors.status && (
              <p className="form-error">{formik.errors.status}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              className="form-input"
              {...formik.getFieldProps("priority")}
              disabled={!formik.values.orgId}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {formik.touched.priority && formik.errors.priority && (
              <p className="form-error">{formik.errors.priority}</p>
            )}
          </div>
        </div>

        <div className="form-group flex flex-wrap gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="datetime-local"
              id="dueDate"
              className="form-input"
              {...formik.getFieldProps("dueDate")}
            />
            {formik.touched.dueDate && formik.errors.dueDate && (
              <p className="form-error">{formik.errors.dueDate}</p>
            )}
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="assignedTo">Assign To</label>
            <select
              id="assignedTo"
              className="form-input"
              {...formik.getFieldProps("assignedTo")}
              disabled={!formik.values.orgId}
            >
              <option value="">Select Assignee</option>
              {orgMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.displayName}
                </option>
              ))}
            </select>
            {formik.touched.assignedTo && formik.errors.assignedTo && (
              <p className="form-error">{formik.errors.assignedTo}</p>
            )}
          </div>
        </div>

        <div className="action-cont flex gap-2 mt-4 justify-end">
          {onClose && (
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={formik.isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            className="btn primary grow"
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            <span>{mode === "create" ? "Create Task" : "Save Changes"}</span>
            {loading && <Loader loading={loading} className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
