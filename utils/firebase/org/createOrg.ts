// ./utils/firebase/org/createOrg.ts
import { db } from "@/firebase";
import { FirestoreOrg } from "@/types";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
/**
 * Creates a new organization in Firestore if it doesn't already exist
 * @param name - Name of the organization
 * @returns Promise with result message, success status, and organization data
 */
const createOrg = async ({ name, user }: { name: string; user: string }) => {
  try {
    // check if user has permission to create org
    const check = await (
      await fetch("/api/permit/check", {
        method: "POST",
        body: JSON.stringify({
          user,
          action: "create",
          resource: "Organization",
        }),
      })
    ).json();

    if (!check) throw new Error("User does not have permission to create org");

    // Guard clause for missing name
    if (!name) {
      console.error("Invalid organization name provided");
      return {
        success: false,
        message: "Invalid organization name",
      };
    }

    const orgRef = doc(db, "orgs", name);

    // Check if organization already exists in Firestore
    const orgSnap = await getDoc(orgRef);

    if (!orgSnap.exists()) {
      // Create new organization record with server timestamp
      const orgData: FirestoreOrg = {
        name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user,
      };

      await setDoc(orgRef, orgData);
      console.log(`Organization created successfully: ${name}`);

      // Get the fresh document to return the complete data
      const newOrgSnap = await getDoc(orgRef);
      console.log(newOrgSnap.id);

      const newOrgData = { ...newOrgSnap.data(), id: newOrgSnap.id };

      // create resorce instance for the org
      await fetch("/api/permit/create-resource-instance", {
        method: "POST",
        body: JSON.stringify({
          key: newOrgData.id,
          resource: "Organization",
          tenant: "default",
        }),
      });

      // assign role of org admin to the user
      await fetch("/api/permit/assign-role", {
        method: "POST",
        body: JSON.stringify({
          user,
          role: "admin",
          resource_type: "Organization",
          resource_instance: newOrgData.id,
        }),
      });

      return {
        success: true,
        message: "Organization created successfully",
        org: newOrgData,
      };
    } else {
      console.log(`Organization already exists: ${name}`);
      // Return the existing organization data
      const existingOrgData = orgSnap.data();

      return {
        success: true,
        message: "Organization already exists",
        org: existingOrgData,
      };
    }
  } catch (error) {
    console.error("Error creating organization:", error);
    return {
      success: false,
      message: "Failed to create organization",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export default createOrg;
