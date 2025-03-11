// ./app/api/permit/create-resource-instance/route.ts

// Import Permit.io instance and Next.js response helper
import permit from "@/lib/permit";
import { NextResponse } from "next/server";

// Define a POST request handler
const POST = async (req: Request) => {
  try {
    const body = await req.json(); // Parse request body
    console.log("Creating resource instance:", body);

    // Create a new resource instance using Permit.io
    const resourceInstance = await permit.api.resourceInstances.create({
      key: body.key, // Unique identifier for the resource instance
      resource: body.resource, // Resource type (e.g., "document", "project")
      tenant: "default", // Tenant scope (default if not specified)
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Resource instance created successfully",
      data: resourceInstance,
    });
  } catch (error) {
    console.log("Error creating resource instance:", (error as Error).message);

    // Return error response
    return new Response(
      `Failed to create resource instance ${(error as Error).message}`,
      {
        status: 500,
      }
    );
  }
};

// Export the handler
export { POST };
