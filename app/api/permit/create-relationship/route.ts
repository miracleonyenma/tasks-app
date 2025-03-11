// ./app/api/permit/create-relationship/route.ts

// Import Permit.io instance and Next.js response helper
import permit from "@/lib/permit";
import { NextResponse } from "next/server";

// Define a POST request handler
const POST = async (req: Request) => {
  try {
    const body = await req.json(); // Parse request body
    console.log("Creating resource relationship:", body);

    // Create a resource relationship using Permit.io
    const resourceRelationship = await permit.api.relationshipTuples.create({
      subject: body.subject, // The user or entity involved
      relation: body.relation, // The type of relationship (e.g., owner, member)
      object: body.object, // The resource being related to
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Resource relationship created successfully",
      data: resourceRelationship,
    });
  } catch (error) {
    console.log("Error creating resource relationship:", error);

    // Return error response
    return new Response(
      `Failed to create resource relationship ${(error as Error).message}`,
      {
        status: 500,
      }
    );
  }
};

// Export the handler
export { POST };
