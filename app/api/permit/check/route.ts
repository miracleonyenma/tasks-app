import permit from "@/lib/permit";

const POST = async (req: Request) => {
  try {
    const body = await req.json();
    console.log("Checking if user:", body);
    const check = await permit.check(
      body.user,
      body.action,
      body.resource,
      body.context
    );

    return new Response(JSON.stringify(check), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("Error checking user:", error);
    return new Response(`Failed to check user: ${(error as Error).message}`, {
      status: 500,
    });
  }
};

export { POST };
