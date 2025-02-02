import { dbConnect } from '@/lib/db';
import { NextResponse } from 'next/server';


// export async function GET() {
//     try {
//         const connection = await dbConnect()
//         const [rows] = await connection.query(
//             'SELECT tanggal, SUM(jumlah_pemasukan) AS total_pemasukan FROM income GROUP BY tanggal ORDER BY tanggal DESC'
//         );
//         await connection.end();
//         return new Response(JSON.stringify({ data: rows }), { status: 200 })

//     } catch (error) {
//         return new Response(JSON.stringify({ error: 'Gagal mengambil data', details: error.message }), { status: 500 })
//     }
// }


export async function GET() {
    try {
        const connection = await dbConnect();
        const [rows] = await connection.query(
            'SELECT tanggal, SUM(jumlah_pemasukan) AS total_pemasukan FROM income GROUP BY tanggal ORDER BY tanggal DESC'
        );

        const formattedRows = rows.map(({ tanggal, total_pemasukan }) => ({
            tanggal: new Date(tanggal).toLocaleDateString('id-ID', {
                weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
            }).replace(/\//g, '-'),
            total_pemasukan
        }));

        await connection.end();
        return Response.json({ success: true, data: formattedRows });

    } catch (error) {
        return Response.json({ success: false, error: 'Gagal mengambil data', details: error.message }, { status: 500 });
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
