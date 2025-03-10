"use client";

import React from "react";
import { auth } from "@/firebase";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import createMember from "@/utils/firebase/member/createMember";
import getUserByEmail from "@/utils/firebase/user/getUserByEmail";
import Loader from "@/components/Loader";

const AddMemberForm: React.FC<{
  orgId: string;
  onClose: () => void;
}> = ({ orgId, onClose }) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      // must not contain spaces after trimming
      email: Yup.string()
        .required("User email is required")
        .trim()
        .notOneOf([" "])
        .email("Invalid email address"),
    }),
    onSubmit: (values) => {
      handleGetUserByEmail(values.email, handleCreateMember);
    },
  });

  const handleGetUserByEmail = async (
    email: string,
    cb: (orgId: string, userId: string) => void
  ) => {
    if (!email || !user?.uid) return;
    toast.promise(getUserByEmail(email), {
      loading: "Checking if user exists...",
      success: (data) => {
        if (!data.success) throw new Error(data.message);

        if (data.success && data.user) {
          cb(orgId, data.user.id);
          return "User exists";
        } else {
          throw new Error("User does not exist");
        }
      },
      error: (error) => {
        return error.message;
      },
      finally: () => {
        setLoading(false);
      },
    });
  };

  const handleCreateMember = (orgId: string, userId: string) => {
    toast.promise(
      createMember({
        invitedBy: user?.uid || "",
        orgId,
        userId: userId,
      }),
      {
        loading: (() => {
          setLoading(true);
          return "Adding user to organization...";
        })(),
        success: (data) => {
          if (!data.success) throw new Error(data.message);

          console.log({ data });
          onClose();
          return "User added to organization successfully";
        },
        error: (error) => {
          return error.message;
        },
        finally: () => {
          setLoading(false);
        },
      }
    );
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-input"
            {...formik.getFieldProps("email")}
          />
          {formik.errors.email && formik.touched.email && (
            <p className="form-error">{formik.errors.email}</p>
          )}
        </div>
        <div className="action-cont">
          <button type="submit" className="btn primary" disabled={loading}>
            <span>Add</span>
            <Loader loading={loading} className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddMemberForm;
