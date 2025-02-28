import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const db = await dbConnect()
        const [rows] = await db.execute('SELECT * FROM menu')

        if (!rows.length) {
            return NextResponse.json({ message: 'Menu kosong' }, { status: 404 })
        }

        // Konversi kolom composition dari JSON string ke objek
        const formattedRows = rows.map(row => ({
            ...row,
            composition: row.composition ? JSON.parse(row.composition) : null
        }))

        return NextResponse.json(formattedRows, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(req) {
    try {
        const { id, price, composition } = await req.json()
        if (!id) return NextResponse.json({ message: "ID diperlukan" }, { status: 400 })

        const db = await dbConnect()

        if (composition) {
            await db.execute("UPDATE menu SET composition = ? WHERE id = ?", [
                JSON.stringify(composition),
                id,
            ])
            return NextResponse.json({ message: "Komposisi berhasil diperbarui" }, { status: 200 })
        }

        if (price !== undefined) {
            await db.execute("UPDATE menu SET price = ? WHERE id = ?", [Math.floor(price), id])
            return NextResponse.json({ message: "Harga berhasil diperbarui" }, { status: 200 })
        }

        return NextResponse.json({ message: "Tidak ada data yang diperbarui" }, { status: 400 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
