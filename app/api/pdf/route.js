import { dbConnect } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req) {
    try {
        const connection = await dbConnect()
        const url = new URL(req.url)
        const tanggal = url.searchParams.get("tanggal") || new Date().toISOString().split("T")[0] // Default ke hari ini

        const [rows] = await connection.execute(
            "SELECT * FROM history WHERE DATE(tanggal) = ?",
            [tanggal]
        )
        
        return NextResponse.json(rows)
    } catch (error) {
        return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }
}
