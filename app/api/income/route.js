import { dbConnect } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function GET() {
    try {
        const connection = await dbConnect();

        const [
            [pemasukanRows], 
            [kebabRows], 
            [burgerRows], 
            [minumanRows]
        ] = await Promise.all([
            connection.query('SELECT SUM(jumlah_pemasukan) AS total_pemasukan FROM income WHERE tanggal = CURDATE()'),
            connection.query("SELECT SUM(item) AS total_kebab FROM income WHERE DATE(tanggal) = CURDATE() AND category = 'kebab'"),
            connection.query("SELECT SUM(item) AS total_burger FROM income WHERE DATE(tanggal) = CURDATE() AND category = 'burger'"),
            connection.query("SELECT SUM(item) AS total_minuman FROM income WHERE DATE(tanggal) = CURDATE() AND category = 'minuman'")
        ]);

        const today = new Date().toLocaleDateString('id-ID', {
            weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
        }).replace(/\//g, '-');

        await connection.end();

        return NextResponse.json({
            success: true,
            data: {
                tanggal: today,
                total_pemasukan: pemasukanRows[0]?.total_pemasukan || 0,
                total_kebab: kebabRows[0]?.total_kebab || 0,
                total_burger: burgerRows[0]?.total_burger || 0,
                total_minuman: minumanRows[0]?.total_minuman || 0
            }
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Gagal mengambil data', details: error.message }, 
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const { totalHarga, item, category, nama } = await req.json();

        const connection = await dbConnect();

        const [result] = await connection.execute(
            'INSERT INTO income (jumlah_pemasukan, item, category, name) VALUES (?, ?, ?, ?)',
            [totalHarga, item, category, nama]
        );

        return new Response(JSON.stringify({ message: 'Data berhasil disimpan', result }), { status: 200 });
    } catch (error) {
        console.error('Error saat menyimpan data:', error);
        return new Response(JSON.stringify({ error: 'Gagal menyimpan data', details: error.message }), { status: 500 });
    }
}
