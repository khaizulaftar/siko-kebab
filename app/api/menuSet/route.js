import { dbConnect } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const db = await dbConnect();
        const [rows] = await db.execute('SELECT * FROM menu');

        if (!rows.length) {
            return NextResponse.json({ message: 'Menu kosong' }, { status: 404 });
        }
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { id, price } = await req.json();

        if (!id || !price) {
            return NextResponse.json({ message: 'ID dan harga baru diperlukan' }, { status: 400 });
        }

        const priceInt = Math.floor(price);

        const db = await dbConnect();
        const [result] = await db.execute('UPDATE menu SET price = ? WHERE id = ?', [priceInt, id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Menu tidak ditemukan' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Harga berhasil diperbarui' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
