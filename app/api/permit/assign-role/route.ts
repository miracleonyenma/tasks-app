// ./app/api/permit/assign-role/route.ts

// Import Permit.io instance and Next.js response helper
import permit from "@/lib/permit";
import { NextResponse } from "next/server";

// Define a POST request handler
const POST = async (req: Request) => {
  try {
    const body = await req.json(); // Parse request body
    console.log("Assigning role to user:", body);

    // Assign role to user using Permit.io
    const assignedRole = await permit.api.assignRole({
      role: body.role, // Role to assign
      user: body.user, // User to assign role to
      ...(body?.resource_type &&
        body?.resource_instance && {
          resource_instance: `${body.resource_type}:${body.resource_instance}`, // Optional resource instance
        }),
      ...(body?.tenant && { tenant: body.tenant }), // Optional tenant
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Role assigned successfully",
      data: assignedRole,
    });
  } catch (error) {
    console.log("Error assigning role:", error);

    // Return error response
    return new Response(`Failed to assign role ${(error as Error).message}`, {
      status: 500,
    });
  }
};

// Export the handler
export { POST };
