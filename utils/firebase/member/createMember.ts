// ./utils/firebase/membership/createMember.ts

import { db } from "@/firebase";
import { FirestoreMembership, MembershipInput } from "@/types";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

/**
 * Creates a new membership in Firestore if it doesn't already exist
 * @param membershipInput - Membership input data
 * @returns Promise with result message and success status
 */
const createMember = async (membershipInput: MembershipInput) => {
  try {
    // Guard clause for missing essential data
    if (!membershipInput?.orgId || !membershipInput?.userId) {
      console.error("Invalid membership data provided");
      return {
        success: false,
        message: "Invalid membership data",
      };
    }

    const { orgId, userId, status, invitedBy } = membershipInput;

    // Create a unique ID combining orgId and userId
    const membershipId = `${orgId}_${userId}`;
    const membershipRef = doc(db, "memberships", membershipId);

    // Check if membership already exists
    const membershipSnap = await getDoc(membershipRef);

    if (membershipSnap.exists()) {
      console.log(
        `Membership already exists for user ${userId} in org ${orgId}`
      );
      return {
        success: false,
        message: "User is already a member of this organization",
        membership: membershipSnap.data(),
      };
    }

    // Check if user exists (optional - depends on your app flow)
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error(`User ${userId} does not exist`);
      return {
        success: false,
        message: "User does not exist",
      };
    }

    // Check if organization exists (optional - depends on your app flow)
    const orgRef = doc(db, "orgs", orgId);
    const orgSnap = await getDoc(orgRef);

    if (!orgSnap.exists()) {
      console.error(`Organization ${orgId} does not exist`);
      return {
        success: false,
        message: "Organization does not exist",
      };
    }

    // Create membership data
    const membershipData: FirestoreMembership = {
      orgId,
      userId,
      status: status || "invited", // Default status if not specified
      invitedBy,
      invitedAt: serverTimestamp(),
      joinedAt: status === "active" ? serverTimestamp() : null,
      lastActiveAt: status === "active" ? serverTimestamp() : null,
    };

    // Create the membership
    await setDoc(membershipRef, membershipData);
    console.log(`Membership created successfully: ${membershipId}`);

    // assign role to user
    await fetch("/api/permit/assign-role", {
      method: "POST",
      body: JSON.stringify({
        role: "member",
        user: userId,
        resource_instance: orgId,
        resource_type: "Organization",
      }),
    });

    return {
      success: true,
      message: "Membership created successfully",
      membership: {
        orgId,
        userId,
        status,
      },
    };
  } catch (error) {
    console.error("Error creating membership:", error);
    return {
      success: false,
      message: "Failed to create membership",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export default createMember;
