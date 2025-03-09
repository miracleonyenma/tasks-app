import permit from "@/lib/permit";
import { NextResponse } from "next/server";

const GET = async () => {
  try {
    const resources = await permit.api.resourceInstances.list();
    return NextResponse.json({
      success: true,
      message: "Resources listed successfully",
      data: resources,
    });
  } catch (error) {
    console.log("Error listing resources:", error);
    return new Response(
      `Failed to list resources ${(error as Error).message}`,
      {
        status: 500,
      }
    );
  }
};

export { GET };
