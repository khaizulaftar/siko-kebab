import { dbConnect } from '@/lib/db'

export async function GET() {
    try {
        const pool = await dbConnect()
        const [rows] = await pool.execute("SHOW TABLES") // Cek apakah tabel muncul
        return Response.json(rows)
    } catch (error) {
        console.error("Database Error:", error)
        return Response.json({ message: "Error fetching data", error }, { status: 500 })
    }
}