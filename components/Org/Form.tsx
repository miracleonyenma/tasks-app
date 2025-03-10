"use client";

import { auth } from "@/firebase";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import createOrg from "@/utils/firebase/org/createOrg";
import Loader from "@/components/Loader";
import createMember from "@/utils/firebase/member/createMember";

const CreateOrgForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [user] = useAuthState(auth);

  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      orgName: "",
    },
    validationSchema: Yup.object({
      // must not contain spaces after trimming
      orgName: Yup.string()
        .required("Org name is required")
        .trim()
        .notOneOf([" "])
        .min(3)
        .max(20)
        .matches(/^[a-zA-Z0-9]+$/, "Only alphanumeric characters are allowed"),
    }),
    onSubmit: (values) => {
      console.log(values);
      if (user?.uid) {
        handleCreateOrg((orgId) => {
          handleCreateMember(orgId, user?.uid);
          formik.resetForm();
        });
      }
      onClose();
    },
  });

  const handleCreateOrg = async (cb: (orgId: string) => void) => {
    if (!user?.uid)
      return toast.error("Please login to create an organization");
    toast.promise(createOrg({ name: formik.values.orgName, user: user?.uid }), {
      loading: (() => {
        setLoading(true);
        return "Creating organization...";
      })(),
      success: (data) => {
        console.log({ data });
        if (!data.success) throw new Error(data.message);
        cb(data.org?.id);
        return "Organization created successfully";
      },
      error: (error) => {
        return error.message;
      },
      finally: () => {
        setLoading(false);
        formik.setSubmitting(false);
      },
    });
  };

  const handleCreateMember = async (orgId: string, userId: string) => {
    toast.promise(createMember({ orgId, userId, invitedBy: userId }), {
      loading: (() => {
        setLoading(true);
        return "Adding user to organization...";
      })(),
      success: (data) => {
        console.log({ data });
        return "User added to organization successfully";
      },
      error: (error) => {
        return error.message;
      },
      finally: () => {
        setLoading(false);
        formik.setSubmitting(false);
      },
    });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="orgName">Organization Name</label>
          <input
            type="text"
            placeholder="Acme Corp"
            id="orgName"
            className="form-input"
            {...formik.getFieldProps("orgName")}
          />
          {formik.touched.orgName && formik.errors.orgName && (
            <p className="form-error">{formik.errors.orgName}</p>
          )}
        </div>
        <div className="action-cont">
          <button
            className="btn primary"
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            <span>Create</span>
            <Loader loading={loading} className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateOrgForm;
