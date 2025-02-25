import { dbConnect } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const db = await dbConnect();
        const [rows] = await db.execute('SELECT * FROM menu');

        if (!rows.length) {
            return NextResponse.json({ message: 'Menu kosong' }, { status: 404 });
        }

        // Konversi kolom composition dari JSON string ke objek
        const formattedRows = rows.map(row => ({
            ...row,
            composition: row.composition ? JSON.parse(row.composition) : null
        }));

        return NextResponse.json(formattedRows, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { id, price } = await req.json();
        if (!id || !price) return NextResponse.json({ message: 'ID dan harga baru diperlukan' }, { status: 400 });

        const db = await dbConnect();
        const [result] = await db.execute('UPDATE menu SET price = ? WHERE id = ?', [Math.floor(price), id]);

        return NextResponse.json({ message: result.affectedRows ? 'Harga berhasil d iperbarui' : 'Menu tidak ditemukan' }, 
            { status: result.affectedRows ? 200 : 404 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
