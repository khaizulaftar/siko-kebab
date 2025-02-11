import { dbConnect } from '@/lib/db';
import { NextResponse } from 'next/server';



export async function GET() {
    const db = await dbConnect();
    const [rows] = await db.execute('SELECT * FROM history');

    if (!rows.length) {
        return NextResponse.json({ message: 'Tidak ada history' }, { status: 404 });
    }

    return NextResponse.json(rows);
}

export async function POST(req) {
    try {
        const { totalHarga, item, category, nama } = await req.json();

        const connection = await dbConnect();

        const [result] = await connection.execute(
            'INSERT INTO history (jumlah_pemasukan, item, category, name) VALUES (?, ?, ?, ?)',
            [totalHarga, item, category, nama]
        );

        return new Response(JSON.stringify({ message: 'Data berhasil disimpan', result }), { status: 200 });
    } catch (error) {
        console.error('Error saat menyimpan data:', error);
        return new Response(JSON.stringify({ error: 'Gagal menyimpan data', details: error.message }), { status: 500 });
    }
}