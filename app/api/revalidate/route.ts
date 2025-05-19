import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const tag = request.nextUrl.searchParams.get("tag");

    if (!tag) {
      return NextResponse.json(
        { success: false, message: "Missing tag parameter" },
        { status: 400 }
      );
    }

    // Authenticate the request in production
    if (process.env.NODE_ENV === "production") {
      const authHeader = request.headers.get("authorization");

      if (
        !authHeader ||
        authHeader !== `Bearer ${process.env.REVALIDATION_TOKEN}`
      ) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    // Revalidate the tag
    revalidateTag(tag);

    return NextResponse.json({
      success: true,
      message: `Revalidated tag: ${tag}`,
      revalidated: true,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error revalidating",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
