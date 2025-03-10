import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const tanggalRaw = searchParams.get("tanggal") || new Date().toISOString().split("T")[0];

        // Format tanggal
        const [year, month, day] = tanggalRaw.split("-").map(Number);
        const formattedTanggal = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }).format(new Date(year, month - 1, day));

        const connection = await dbConnect();

        const [[pemasukanRows], [kebabRows], [burgerRows], [minumanRows]] = await Promise.all([
            connection.query("SELECT SUM(jumlah_pemasukan) AS total_pemasukan FROM income WHERE tanggal = ?", [tanggalRaw]),
            connection.query("SELECT SUM(item) AS total_kebab FROM income WHERE tanggal = ? AND category = 'kebab'", [tanggalRaw]),
            connection.query("SELECT SUM(item) AS total_burger FROM income WHERE tanggal = ? AND category = 'burger'", [tanggalRaw]),
            connection.query("SELECT SUM(item) AS total_minuman FROM income WHERE tanggal = ? AND category = 'minuman'", [tanggalRaw])
        ]);

        return NextResponse.json({
            success: true,
            data: {
                tanggal: formattedTanggal,
                total_pemasukan: pemasukanRows[0]?.total_pemasukan || 0,
                total_kebab: kebabRows[0]?.total_kebab || 0,
                total_burger: burgerRows[0]?.total_burger || 0,
                total_minuman: minumanRows[0]?.total_minuman || 0
            }
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Gagal mengambil data", details: error.message },
            { status: 500 }
        );
    }
}


export async function POST(req) {
    try {
        const { totalHarga, item, category, nama } = await req.json()

        const connection = await dbConnect()

        const [result] = await connection.execute(
            'INSERT INTO income (jumlah_pemasukan, item, category, name) VALUES (?, ?, ?, ?)',
            [totalHarga, item, category, nama]
        )

        return new Response(JSON.stringify({ message: 'Data berhasil disimpan', result }), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Gagal menyimpan data', details: error.message }), { status: 500 })
    }
}