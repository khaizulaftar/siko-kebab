import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const bulanRaw = searchParams.get("bulan") || new Date().toISOString().slice(0, 7) // Format YYYY-MM

        const [year, month] = bulanRaw.split("-").map(Number)

        const db = await dbConnect()

        const [[pemasukanRows], [kebabRows], [burgerRows], [minumanRows]] = await Promise.all([
            db.query("SELECT SUM(jumlah_pemasukan) AS total_pemasukan FROM income WHERE YEAR(tanggal) = ? AND MONTH(tanggal) = ?", [year, month]),
            db.query("SELECT SUM(item) AS total_kebab FROM income WHERE YEAR(tanggal) = ? AND MONTH(tanggal) = ? AND category = 'kebab'", [year, month]),
            db.query("SELECT SUM(item) AS total_burger FROM income WHERE YEAR(tanggal) = ? AND MONTH(tanggal) = ? AND category = 'burger'", [year, month]),
            db.query("SELECT SUM(item) AS total_minuman FROM income WHERE YEAR(tanggal) = ? AND MONTH(tanggal) = ? AND category = 'minuman'", [year, month])
        ])

        return NextResponse.json({
            success: true,
            data: {
                bulan: bulanRaw,
                total_pemasukan: pemasukanRows[0]?.total_pemasukan || 0,
                total_kebab: kebabRows[0]?.total_kebab || 0,
                total_burger: burgerRows[0]?.total_burger || 0,
                total_minuman: minumanRows[0]?.total_minuman || 0
            }
        })

    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Gagal mengambil data", details: error.message },
            { status: 500 }
        )
    }
}
