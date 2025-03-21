import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const bulanRaw = searchParams.get("bulan") || new Date().toISOString().slice(0, 7) // Format YYYY-MM

        const [year, month] = bulanRaw.split("-").map(Number)

        const db = await dbConnect()
        const [rows] = await db.execute(`
            SELECT 
                name, 
                price, 
                SUM(stock) AS total_stock, 
                SUM(out_stock) AS total_out_stock 
            FROM ingredients 
            WHERE YEAR(tanggal) = ? AND MONTH(tanggal) = ? 
            GROUP BY name, price
        `, [year, month])

        const stockData = rows.map(item => ({
            name: item.name,
            price: item.price,
            total_stock: item.total_stock || 0,
            total_out_stock: item.total_out_stock || 0,
            harga_masuk: (item.price * (item.total_stock || 0)),
            harga_keluar: (item.price * (item.total_out_stock || 0)),
            selisih: (item.price * ((item.total_stock || 0) - (item.total_out_stock || 0)))
        }))

        return NextResponse.json(stockData.length ? stockData : { message: 'Data kosong' }, { status: stockData.length ? 200 : 404 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}