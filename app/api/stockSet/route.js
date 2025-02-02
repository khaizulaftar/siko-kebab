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
        if (!id || !stock) return NextResponse.json({ message: 'ID dan jumlah stock baru diperlukan' }, { status: 400 });

        const db = await dbConnect();
        
        // Ambil stock awal
        const [[existing]] = await db.execute('SELECT stock, initial_stock FROM ingredients WHERE id = ?', [id]);
        if (!existing) return NextResponse.json({ message: 'Menu tidak ditemukan' }, { status: 404 });
        
        const initialStock = existing.initial_stock || existing.stock;
        const finalStock = stock > existing.stock ? stock - existing.stock : 0;
        const outStock = stock < existing.stock ? existing.stock - stock : 0;
        
        // Update stock di database
        const [result] = await db.execute(
            'UPDATE ingredients SET stock = ?, initial_stock = ?, final_stock = ?, out_stock = ? WHERE id = ?',
            [stock, initialStock, finalStock, outStock, id]
        );
        
        return NextResponse.json({
            message: result.affectedRows ? 'Stock berhasil diperbarui' : 'Menu tidak ditemukan',
            data: { stock, initialStock, finalStock, outStock }
        }, { status: result.affectedRows ? 200 : 404 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
