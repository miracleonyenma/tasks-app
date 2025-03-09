import permit from "@/lib/permit";
import { NextResponse } from "next/server";

const POST = async (req: Request) => {
  try {
    const body = await req.json();
    console.log("Assigning role to user:", body);
    const assignedRole = await permit.api.assignRole({
      role: body.role,
      user: body.user,
      resource_instance: `${body.resource_type}:${body.resource_instance}`,
    });
    return NextResponse.json({
      success: true,
      message: "Role assigned successfully",
      data: assignedRole,
    });
  } catch (error) {
    console.log("Error assigning role:", error);
    return new Response(`Failed to assign role ${(error as Error).message}`, {
      status: 500,
    });
  }
};

export { POST };
