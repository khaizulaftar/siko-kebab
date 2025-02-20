import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, "SECRET");

        const db = await dbConnect();
        const [users] = await db.query("SELECT username, role FROM users WHERE username = ?", [decoded.username]);

        if (users.length === 0) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json({ user: users[0] });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
