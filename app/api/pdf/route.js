import { dbConnect } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const connection = await dbConnect()
        const [rows] = await connection.execute(
            "SELECT * FROM history WHERE DATE(tanggal) = CURDATE()"
        )
        
        return NextResponse.json(rows)
    } catch (error) {
        return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }
}