import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const db = await dbConnect()
        const [rows] = await db.execute('SELECT * FROM ingredients')
        return NextResponse.json(rows.length ? rows : { message: 'Menu kosong' }, { status: rows.length ? 200 : 404 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(req) {
    try {
        const { id, stock, price } = await req.json()
        if (!id || (stock === undefined && price === undefined)) {
            return NextResponse.json({ message: 'ID dan salah satu dari stock atau price diperlukan' }, { status: 400 })
        }

        const db = await dbConnect()
        const today = new Date().toISOString().split('T')[0]

        const [[existing]] = await db.execute(
            'SELECT stock, initial_stock, final_stock, out_stock, tanggal, price FROM ingredients WHERE id = ?',
            [id]
        )

        if (!existing) {
            return NextResponse.json({ message: 'Menu tidak ditemukan' }, { status: 404 })
        }

        let { stock: currentStock, initial_stock: initialStock, tanggal: lastUpdatedDate, price: currentPrice } = existing
        let finalStock = existing.final_stock || 0
        let outStock = existing.out_stock || 0

        // Update stok jika diberikan
        if (stock !== undefined) {
            if (lastUpdatedDate !== today) {
                initialStock = currentStock
            }

            if (stock > currentStock) {
                finalStock += stock - currentStock
            } else if (stock < currentStock) {
                outStock += currentStock - stock
            }
        }

        // Update harga jika diberikan
        const newPrice = price !== undefined ? price : currentPrice

        const [result] = await db.execute(
            'UPDATE ingredients SET stock = ?, initial_stock = ?, final_stock = ?, out_stock = ?, price = ?, tanggal = ? WHERE id = ?',
            [stock ?? currentStock, initialStock, finalStock, outStock, newPrice, today, id]
        )

        return NextResponse.json({
            message: result.affectedRows ? 'Data berhasil diperbarui' : 'Menu tidak ditemukan',
            data: { stock, initialStock, finalStock, outStock, price: newPrice, tanggal: today }
        }, { status: result.affectedRows ? 200 : 404 })

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
