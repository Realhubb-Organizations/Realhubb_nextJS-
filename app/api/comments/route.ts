import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    const googleCommentsScriptUrl = process.env.GOOGLE_COMMENTS_SCRIPT_URL;

    if (!googleCommentsScriptUrl) {
      console.error("[Comments API] GOOGLE_COMMENTS_SCRIPT_URL is not defined in the environment variables.");
      return NextResponse.json(
        { error: "Integration not configured" },
        { status: 500 }
      );
    }

    let url = googleCommentsScriptUrl;
    if (slug) {
      url += `?slug=${encodeURIComponent(slug)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[Comments API] Google Apps Script responded with status: ${response.status}`);
      return NextResponse.json(
        { error: "Failed to fetch comments" },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[Comments API] Error in GET comments route:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const googleCommentsScriptUrl = process.env.GOOGLE_COMMENTS_SCRIPT_URL;

    if (!googleCommentsScriptUrl) {
      console.error("[Comments API] GOOGLE_COMMENTS_SCRIPT_URL is not defined in the environment variables.");
      return NextResponse.json(
        { success: false, error: "Integration not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(googleCommentsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`[Comments API] Google Apps Script responded with status: ${response.status}`);
      return NextResponse.json(
        { success: false, error: "Failed to post comment data" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Comments API] Error in POST comments route:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
