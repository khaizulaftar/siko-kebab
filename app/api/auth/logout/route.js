import { NextResponse } from "next/server"
import { serialize } from "cookie"

export async function DELETE() {
    const cookie = serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
    })

    const response = NextResponse.json({ message: "Logout successful" })
    response.headers.set("Set-Cookie", cookie)
    return response
}