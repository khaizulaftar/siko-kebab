import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const connection = await dbConnect()

        const [rows] = await connection.query(`
            SELECT 
            tanggal, category, SUM(item) as total_item
            FROM income
            GROUP BY tanggal, category
            ORDER BY tanggal ASC
        `)

        const [totalIncomeRows] = await connection.query(`
            SELECT tanggal, SUM(jumlah_pemasukan) as total_pemasukan
            FROM income
            GROUP BY tanggal
            ORDER BY tanggal ASC
        `)

        await connection.end()
        const result = { tanggal: [], hari: {}, total_pemasukan: [] }

        rows.forEach(row => {
            const dateObj = new Date(row.tanggal)
            const formattedDate = dateObj.toLocaleDateString('id-ID', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            }).replace(/\//g, '-')

            const firstLetterOfDay = dateObj.toLocaleDateString('id-ID', { weekday: 'long' }).slice(0, 3)

            if (!result.tanggal.includes(formattedDate)) {
                result.tanggal.push(formattedDate)
                result.hari[formattedDate] = firstLetterOfDay
            }

            if (!result[`total_${row.category}`]) result[`total_${row.category}`] = []
            result[`total_${row.category}`].push(row.total_item)
        })

        totalIncomeRows.forEach(row => {
            const formattedDate = new Date(row.tanggal).toLocaleDateString('id-ID', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            }).replace(/\//g, '-')
            result.total_pemasukan.push(row.total_pemasukan)
        })

        return NextResponse.json({
            success: true,
            data: result
        })

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Gagal mengambil data', details: error.message }, 
            { status: 500 }
        )
    }
}