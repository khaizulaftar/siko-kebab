import { dbConnect } from "@/lib/db"
import { NextResponse } from "next/server"
import moment from "moment-timezone"

export async function GET(req) {
    try {
        const connection = await dbConnect()
        const url = new URL(req.url)

        const userTimeZone = "Asia/Jakarta"
        const now = moment().tz(userTimeZone)
        if (now.hour() < 4) {
            now.subtract(1, "day")
        }
        const tanggal = url.searchParams.get("tanggal") || now.format("YYYY-MM-DD")

        const [rows] = await connection.execute(
            `SELECT 
                category, 
                name, 
                GROUP_CONCAT(DISTINCT keterangan ORDER BY id ASC SEPARATOR ', ') AS keterangan, 
                SUM(item) AS total_item, 
                SUM(jumlah_pemasukan) AS jumlah_pemasukan 
            FROM history 
            WHERE DATE(tanggal) = ? 
            AND keterangan LIKE '%Terjual%'  -- Kondisi untuk hanya mengambil history penjualan
            GROUP BY category, name 
            ORDER BY category ASC, name ASC`,
            [tanggal]
        )
        
        return NextResponse.json(rows)
    } catch (error) {
        return NextResponse.json({ error: "Database connection failed", details: error.message }, { status: 500 })
    }
}