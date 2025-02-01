import { dbConnect } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const db = await dbConnect();
        const [rows] = await db.execute('SELECT * FROM ingredients');
        return NextResponse.json(rows.length ? rows : { message: 'Menu kosong' }, { status: rows.length ? 200 : 404 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { id, stock } = await req.json();
        if (!id || !stock) return NextResponse.json({ message: 'ID dan harga baru diperlukan' }, { status: 400 });

        const db = await dbConnect();
        const [result] = await db.execute('UPDATE ingredients SET stock = ? WHERE id = ?', [Math.floor(stock), id]);
        
        return NextResponse.json({ message: result.affectedRows ? 'Harga berhasil diperbarui' : 'Menu tidak ditemukan' }, { status: result.affectedRows ? 200 : 404 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
