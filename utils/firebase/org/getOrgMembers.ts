// utils/firebase/org/getOrgMembersRealtime.ts
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";

export type OrgMember = {
  id: string;
  displayName: string;
  email?: string;
  photoURL?: string;
};

/**
 * Gets members of an organization in realtime
 * @param orgId - The organization ID
 * @param callback - Function to receive the members data
 * @returns Unsubscribe function
 */
const getOrgMembersRealtime = (
  orgId: string,
  callback: (members: OrgMember[]) => void
) => {
  if (!orgId) {
    callback([]);
    return () => {};
  }

  // Query for memberships where orgId matches
  const membershipQuery = query(
    collection(db, "memberships"),
    where("orgId", "==", orgId)
  );

  // Set up real-time listener
  const unsubscribe = onSnapshot(
    membershipQuery,
    async (snapshot) => {
      try {
        // Get all member data by fetching user documents
        const members = await Promise.all(
          snapshot.docs.map(async (memberDoc) => {
            const memberData = memberDoc.data();
            const userRef = doc(db, "users", memberData.userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const userData = userSnap.data();
              return {
                id: userSnap.id,
                displayName: userData.displayName || userData.email,
                email: userData.email,
                photoURL: userData.photoURL,
                role: memberData.role || "member",
              } as OrgMember;
            }
            return null;
          })
        );

        // Filter out null results and call the callback
        callback(
          members.filter((member): member is OrgMember => member !== null)
        );
      } catch (error) {
        console.error("Error fetching organization members:", error);
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

export default getOrgMembersRealtime;
