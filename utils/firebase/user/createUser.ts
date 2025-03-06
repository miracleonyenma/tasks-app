// ./utils/firebase/user/createUser.ts

import { db } from "@/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { UserCredential } from "firebase/auth";
import { FirestoreUser } from "@/types";

/**
 * Creates a new user in Firestore if they don't already exist
 * @param userCredential - Firebase Auth UserCredential object
 * @returns Promise with result message and success status
 */
const createUser = async (userCredential: UserCredential) => {
  try {
    // Guard clause for missing user data
    if (!userCredential?.user) {
      console.error("Invalid user credentials provided");
      return {
        success: false,
        message: "Invalid user credentials",
      };
    }

    const { uid, displayName, email, photoURL } = userCredential.user;
    // Create a reference to the *user* document in Firestore
    const userRef = doc(db, "users", uid);

    // Check if user already exists in Firestore
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new user record with server timestamp
      const userData: FirestoreUser = {
        displayName,
        email,
        photoURL,
        uid,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };

      await setDoc(userRef, userData);
      console.log(`User created successfully: ${uid}`);

      return {
        success: true,
        message: "User created successfully",
        user: { uid, email },
      };
    } else {
      console.log(`User already exists: ${uid}`);
      return {
        success: true,
        message: "User already exists",
        user: { uid, email },
      };
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: "Failed to create user",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export default createUser;
