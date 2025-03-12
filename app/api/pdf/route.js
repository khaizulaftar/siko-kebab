import { dbConnect } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req) {
    try {
        const connection = await dbConnect()
        const url = new URL(req.url)
        const tanggal = url.searchParams.get("tanggal") || new Date().toISOString().split("T")[0] // Default ke hari ini

        const [rows] = await connection.execute(
            `SELECT 
    category, 
    name, 
    GROUP_CONCAT(DISTINCT keterangan ORDER BY id ASC SEPARATOR ', ') AS keterangan, 
    SUM(item) AS total_item, 
    SUM(jumlah_pemasukan) AS jumlah_pemasukan 
FROM history 
WHERE DATE(tanggal) = ? 
GROUP BY category, name 
ORDER BY category ASC, name ASC`,
            [tanggal]
        )
        
        return NextResponse.json(rows)
    } catch (error) {
        return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }
}
