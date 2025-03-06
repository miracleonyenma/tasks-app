// utils/firebase/org/getUserOrgs.ts
import { db } from "@/firebase";
import { FirestoreMembership, FirestoreOrg } from "@/types";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  DocumentData,
  Timestamp,
} from "firebase/firestore";

/**
 * Gets organizations that a user is a member of in realtime
 */
const getUserOrgsRealtime = (
  userId: string,
  callback: (orgs: Array<FirestoreOrg & { id: string }>) => void
) => {
  if (!userId) return () => {};

  // Query for memberships where this user is a member
  const membershipQuery = query(
    collection(db, "memberships"),
    where("userId", "==", userId)
  );

  // Set up real-time listener
  const unsubscribe = onSnapshot(
    membershipQuery,
    async (snapshot) => {
      try {
        // Extract all organization IDs from memberships
        const memberships = snapshot.docs.map((doc) => doc.data());

        // Fetch the actual organization data
        const organizations = await Promise.all(
          memberships.map(async (membership) => {
            return getOrgWithMembers(membership.orgId);
          })
        );

        // Filter out any null results and call the callback
        callback(
          organizations.filter(
            (org): org is FirestoreOrg & { id: string } => org !== null
          )
        );
      } catch (error) {
        console.error("Error fetching organizations:", error);
        callback([]);
      }
    },
    (error) => {
      console.error("Error in membership listener:", error);
      callback([]);
    }
  );

  return unsubscribe;
};

/**
 * Helper function to get an organization with its members
 */
const getOrgWithMembers = async (
  orgId: string
): Promise<(FirestoreOrg & { id: string }) | null> => {
  try {
    const orgRef = doc(db, "orgs", orgId);
    const orgSnap = await getDoc(orgRef);

    if (!orgSnap.exists()) {
      console.log(`Organization ${orgId} not found`);
      return null;
    }

    const orgData = orgSnap.data() as FirestoreOrg;

    // Convert timestamps if they exist
    const processedOrgData = {
      ...orgData,
      createdAt:
        orgData.createdAt instanceof Timestamp
          ? orgData.createdAt.toDate()
          : orgData.createdAt,
      updatedAt:
        orgData.updatedAt instanceof Timestamp
          ? orgData.updatedAt.toDate()
          : orgData.updatedAt,
    };

    // Get members for this organization
    const members = await getOrgMembers(orgId);

    return {
      ...processedOrgData,
      id: orgSnap.id,
      members: members as FirestoreMembership[],
    };
  } catch (error) {
    console.error(`Error fetching organization ${orgId}:`, error);
    return null;
  }
};

/**
 * Helper function to get members of an organization
 */
const getOrgMembers = async (orgId: string): Promise<DocumentData[]> => {
  try {
    const membershipQuery = query(
      collection(db, "memberships"),
      where("orgId", "==", orgId)
    );

    const membershipSnapshot = await getDocs(membershipQuery);

    if (membershipSnapshot.empty) {
      return [];
    }

    return membershipSnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error(`Error fetching members for org ${orgId}:`, error);
    return [];
  }
};

/**
 * Gets a single organization by ID with real-time updates
 */
export const getOrgRealtime = (
  orgId: string,
  callback: (
    org: (FirestoreOrg & { id: string; members: DocumentData[] }) | null
  ) => void
) => {
  if (!orgId) return () => {};

  // Reference to the org document
  const orgRef = doc(db, "orgs", orgId);

  // Set up real-time listener for organization data
  const unsubscribe = onSnapshot(
    orgRef,
    async (docSnapshot) => {
      try {
        if (!docSnapshot.exists()) {
          console.log(`Organization ${orgId} not found`);
          callback(null);
          return;
        }

        const orgData = docSnapshot.data() as FirestoreOrg;

        // Convert timestamps if they exist
        const processedOrgData = {
          ...orgData,
          createdAt:
            orgData.createdAt instanceof Timestamp
              ? orgData.createdAt.toDate()
              : orgData.createdAt,
          updatedAt:
            orgData.updatedAt instanceof Timestamp
              ? orgData.updatedAt.toDate()
              : orgData.updatedAt,
        };

        // Get members for this organization
        const members = await getOrgMembers(orgId);

        callback({
          ...processedOrgData,
          id: docSnapshot.id,
          members: members as FirestoreMembership[],
        });
      } catch (error) {
        console.error(`Error fetching organization ${orgId}:`, error);
        callback(null);
      }
    },
    (error) => {
      console.error(`Error in organization listener for ${orgId}:`, error);
      callback(null);
    }
  );

  return unsubscribe;
};

export default getUserOrgsRealtime;
