import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const db = await dbConnect()
        const [rows] = await db.execute('SELECT * FROM menus')

        if (!rows.length) {
            return NextResponse.json({ message: 'Menu kosong' }, { status: 404 })
        }

        return NextResponse.json(rows, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request) {
    let connection
    try {
        const { packageName, variant, price, category } = await request.json()

        if (!packageName || !variant || !price || !category) {
            return NextResponse.json({ message: 'Semua field harus diisi' }, { status: 400 })
        }

        const pool = await dbConnect()
        connection = await pool.getConnection()

        // Cek apakah menu sudah ada
        const [existingMenu] = await connection.execute(
            'SELECT * FROM menus WHERE packageName = ? AND variant = ?',
            [packageName, variant]
        )

        if (existingMenu.length > 0) {
            connection.release()
            return NextResponse.json({ message: 'Menu sudah ada' }, { status: 400 })
        }

        const [result] = await connection.execute(
            'INSERT INTO menus (packageName, variant, price, category) VALUES (?, ?, ?, ?)',
            [packageName, variant, price, category]
        )

        connection.release()

        return NextResponse.json(
            { success: true, data: { id: result.insertId, packageName, variant, price, category } },
            { status: 201 }
        )
    } catch (error) {
        if (connection) connection.release()
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request) {
    let connection
    try {
        const { id } = await request.json()

        if (!id) {
            return NextResponse.json({ message: 'ID menu harus diisi' }, { status: 400 })
        }

        const pool = await dbConnect()
        connection = await pool.getConnection()

        const [result] = await connection.execute('DELETE FROM menus WHERE id = ?', [id])

        connection.release()

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Menu tidak ditemukan' }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: 'Menu berhasil dihapus' }, { status: 200 })
    } catch (error) {
        if (connection) connection.release()
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}