import { db } from "@/firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

/**
 * Fetches a user from Firestore by their email address
 * @param email - The email address of the user to find
 * @returns Promise with the user data or null if not found
 */
const getUserByEmail = async (email: string) => {
  try {
    // Guard clause for missing email
    if (!email) {
      console.error("Invalid email provided");
      return {
        success: false,
        message: "Invalid email",
      };
    }

    // Create a query against the users collection
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("email", "==", email.toLowerCase().trim()),
      limit(1)
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`No user found with email: ${email}`);
      return {
        success: false,
        message: "User not found",
      };
    }

    // Get the first matching document
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return {
      success: true,
      message: "User found",
      user: {
        id: userDoc.id,
        ...userData,
      },
    };
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return {
      success: false,
      message: "Failed to fetch user",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export default getUserByEmail;
