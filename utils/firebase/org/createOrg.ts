// ./utils/firebase/org/createOrg.ts
import { db } from "@/firebase";
import { FirestoreOrg } from "@/types";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
/**
 * Creates a new organization in Firestore if it doesn't already exist
 * @param name - Name of the organization
 * @returns Promise with result message, success status, and organization data
 */
const createOrg = async (name: string) => {
  try {
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
      };

      await setDoc(orgRef, orgData);
      console.log(`Organization created successfully: ${name}`);

      // Get the fresh document to return the complete data
      const newOrgSnap = await getDoc(orgRef);
      console.log(newOrgSnap.id);

      const newOrgData = { ...newOrgSnap.data(), id: newOrgSnap.id };

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
