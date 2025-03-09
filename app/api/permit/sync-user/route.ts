import permit from "@/lib/permit";
import { NextResponse } from "next/server";

const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const syncedUser = await permit.api.syncUser(body);
    console.log("Synced user:", syncedUser);
    return NextResponse.json({
      success: true,
      message: "User synced successfully",
      data: syncedUser,
    });
  } catch (error) {
    console.log("Error syncing user:", error);
    return new Response(`Failed to sync user: ${(error as Error).message}`, {
      status: 500,
    });
  }
};

export { POST };
