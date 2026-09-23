import { NextRequest, NextResponse } from "next/server";
import { resolveArchiveStream } from "@/lib/api/archiveStream";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const title = searchParams.get("title");
  const titleEnglish = searchParams.get("titleEnglish") || undefined;
  const ep = parseInt(searchParams.get("ep") || "1", 10);

  if (!id || !title) {
    return NextResponse.json(
      { success: false, error: "Missing required 'id' or 'title' parameter" },
      { status: 400 }
    );
  }

  try {
    const stream = await resolveArchiveStream(id, title, ep, titleEnglish);
    return NextResponse.json(stream, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Stream resolution failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to resolve stream" },
      { status: 500 }
    );
  }
}
