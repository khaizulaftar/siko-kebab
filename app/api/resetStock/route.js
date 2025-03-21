import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import moment from 'moment-timezone'

export async function GET() {
    try {
        const db = await dbConnect()
        const today = moment().tz("Asia/Jakarta").format("YYYY-MM-DD")

        // Query untuk reset stok
        await db.execute(`
        UPDATE ingredients 
        SET 
            initial_stock = stock, 
            final_stock = 0, 
            out_stock = 0, 
            tanggal = ?
        WHERE tanggal < ?
        `, [today, today])

        return NextResponse.json({ message: "Stok berhasil direset." })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}