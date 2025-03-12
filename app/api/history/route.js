import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    const db = await dbConnect()
    const [rows] = await db.execute('SELECT * FROM history')

    if (!rows.length) {
        return NextResponse.json({ message: 'Tidak ada history' }, { status: 404 })
    }

    const groupedHistory = rows.reduce((acc, value) => {
        const date = new Date(value.tanggal).toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })

        if (!acc[date]) acc[date] = []
        acc[date].push(value)
        return acc
    }, {})

    return NextResponse.json(groupedHistory)
}

export async function POST(req) {
    try {
        const { totalHarga, item, keterangan, category, nama, icon } = await req.json()

        const connection = await dbConnect()

        const [result] = await connection.execute(
            'INSERT INTO history (jumlah_pemasukan, item, keterangan, category, name, icon) VALUES (?, ?, ?, ?, ?, ?)',
            [totalHarga, item, keterangan, category, nama, icon]
        )

        return new Response(JSON.stringify({ message: 'Data berhasil disimpan', result }), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Gagal menyimpan data', details: error.message }), { status: 500 })
    }
}