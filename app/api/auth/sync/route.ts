import { NextRequest, NextResponse } from "next/server"
import { buildFallbackUserFromToken, syncUserFromToken, verifyFirebaseUserFromRequest } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const decoded = await verifyFirebaseUserFromRequest(req)
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
      const user = await syncUserFromToken(decoded)

      return NextResponse.json({
        ok: true,
        user: {
          ...user,
          _id: String((user as any)._id ?? ""),
        },
        syncedAt: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error("Auth sync deferred:", error?.message ?? error)
      const user = buildFallbackUserFromToken(decoded)

      return NextResponse.json({
        ok: true,
        syncDeferred: true,
        user: {
          ...user,
          _id: "",
        },
        syncedAt: new Date().toISOString(),
      })
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Auth sync failed",
        message:
          process.env.NODE_ENV === "development"
            ? error?.message ?? "Unexpected server error"
            : "Please verify Firebase and MongoDB configuration.",
      },
      { status: 500 }
    )
  }
}
