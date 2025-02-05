import { dbConnect } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function GET() {
    try {
        const connection = await dbConnect();
        const [rows] = await connection.query(
            'SELECT SUM(jumlah_pemasukan) AS total_pemasukan FROM income WHERE tanggal = CURDATE()'
        );

        const today = new Date().toLocaleDateString('id-ID', {
            weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
        }).replace(/\//g, '-');

        await connection.end();
        return NextResponse.json({
            success: true,
            data: {
                tanggal: today,
                total_pemasukan: rows[0]?.total_pemasukan || 0
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Gagal mengambil data', details: error.message }, { status: 500 });
    }
}





export async function POST(req) {
    try {
        const { totalHarga } = await req.json()
        
        const connection = await dbConnect()

        const [result] = await connection.execute(
            'INSERT INTO income (jumlah_pemasukan) VALUES (?)',
            [totalHarga]
        )

        return new Response(JSON.stringify({ message: 'Data berhasil disimpan', result }), { status: 200 })
    } catch (error) {
        console.error('Error saat menyimpan data:', error)
        return new Response(JSON.stringify({ error: 'Gagal menyimpan data', details: error.message }), { status: 500 })
    }
}
