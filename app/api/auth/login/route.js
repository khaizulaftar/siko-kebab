import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req) {
    try {
        const { username, password } = await req.json();
        const db = await dbConnect();

        const [users] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

        if (users.length === 0 || users[0].password !== password) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const token = jwt.sign({ username: users[0].username, role: users[0].role }, "SECRET", { expiresIn: "1d" });

        const cookie = serialize("token", token, {
            path: "/",
            maxAge: 60 * 60 * 24,
            sameSite: "lax",
            secure: false,
        });

        const response = NextResponse.json({ message: "Login successful", token });
        response.headers.set("Set-Cookie", cookie);
        return response;

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
