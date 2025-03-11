// ./app/api/permit/check/route.ts

// Import Permit.io instance
import permit from "@/lib/permit";

// Define a POST request handler
const POST = async (req: Request) => {
  try {
    const body = await req.json(); // Parse request body
    console.log("Checking if user has permission:", body);

    // Check if the user has the required permission
    const check = await permit.check(
      body.user, // User ID
      body.action, // Action to check (e.g., "read", "write")
      body.resource, // Resource type
      body.context // Optional context data
    );

    // Return the permission check result
    return new Response(JSON.stringify(check), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("Error checking user permission:", error);

    // Return error response
    return new Response(
      `Failed to check user permission: ${(error as Error).message}`,
      {
        status: 500,
      }
    );
  }
};

// Export the handler
export { POST };
