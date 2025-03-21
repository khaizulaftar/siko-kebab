import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const db = await dbConnect()
        const [rows] = await db.execute('SELECT * FROM menu')

        if (!rows.length) {
            return NextResponse.json({ message: 'Menu kosong' }, { status: 404 })
        }

        const formattedRows = rows.map(row => ({
            ...row,
            composition: row.composition ? JSON.parse(row.composition) : null
        }))

        return NextResponse.json(formattedRows, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const { name, price, category, dose, composition } = await req.json()

        if (!name || !price || !category || !dose) {
            return NextResponse.json(
                { message: "Nama, harga, kategori, dan dose diperlukan" },
                { status: 400 }
            )
        }

        if (typeof composition !== 'object' || composition === null) {
            return NextResponse.json(
                { message: "Komposisi harus berupa objek" },
                { status: 400 }
            )
        }

        const db = await dbConnect()

        await db.execute(
            "INSERT INTO menu (name, price, category, dose, composition) VALUES (?, ?, ?, ?, ?)",
            [name, price, category, dose, JSON.stringify(composition)]
        )

        return NextResponse.json(
            { message: "Menu berhasil ditambahkan" },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error in POST /api/menuSet:", error)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
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

export async function DELETE(req) {
    try {
        const { id } = await req.json()
        if (!id) return NextResponse.json({ message: "ID diperlukan" }, { status: 400 })

        const db = await dbConnect()
        await db.execute("DELETE FROM menu WHERE id = ?", [id])

        return NextResponse.json({ message: "Menu berhasil dihapus" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}