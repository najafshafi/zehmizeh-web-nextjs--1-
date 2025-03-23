import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  return NextResponse.redirect(
    new URL(`/client-job-details/${id}/gen_details`, request.url)
  );
}
