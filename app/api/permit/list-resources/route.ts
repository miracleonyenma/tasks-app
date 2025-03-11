// ./app/api/permit/list-resources/route.ts

// Import Permit.io instance and Next.js response helper
import permit from "@/lib/permit";
import { NextResponse } from "next/server";

// Define a GET request handler
const GET = async () => {
  try {
    // Fetch all resource instances using Permit.io
    const resources = await permit.api.resourceInstances.list();

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Resources listed successfully",
      data: resources,
    });
  } catch (error) {
    console.log("Error listing resources:", error);

    // Return error response
    return new Response(
      `Failed to list resources ${(error as Error).message}`,
      {
        status: 500,
      }
    );
  }
};

// Export the handler
export { GET };
