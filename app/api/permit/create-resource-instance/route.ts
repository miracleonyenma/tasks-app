import permit from "@/lib/permit";
import { NextResponse } from "next/server";

const POST = async (req: Request) => {
  try {
    const body = await req.json();
    console.log("Creating resource instance:", body);
    const resourceInstance = await permit.api.resourceInstances.create({
      key: body.key,
      resource: body.resource,
      tenant: "default",
    });
    return NextResponse.json({
      success: true,
      message: "Resource instance created successfully",
      data: resourceInstance,
    });
  } catch (error) {
    console.log("Error creating resource instance:", (error as Error).message);
    return new Response(
      `Failed to create resource instance ${(error as Error).message}`,
      {
        status: 500,
      }
    );
  }
};

export { POST };
