import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    const db = await dbConnect();
    const [rows] = await db.execute('SELECT * FROM history');

    if (!rows.length) {
        return NextResponse.json({ message: 'Tidak ada history' }, { status: 404 });
    }

    // Ambil tanggal dengan zona waktu WIB
    const userTimeZone = "Asia/Jakarta";
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: userTimeZone }));

    // Jika masih antara 00:00 - 01:59 WIB, anggap masih hari sebelumnya
    if (now.getHours() < 2) now.setDate(now.getDate() - 1);

    const groupedHistory = rows.reduce((acc, value) => {
        const dateObj = new Date(value.tanggal);
        const formattedDate = dateObj.toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        if (!acc[formattedDate]) acc[formattedDate] = [];
        acc[formattedDate].push(value);
        return acc;
    }, {});

    return NextResponse.json(groupedHistory);
}

export async function POST(req) {
    try {
        const { totalHarga, item, keterangan, category, nama, icon } = await req.json();

        const connection = await dbConnect();

        // Ambil tanggal dengan zona waktu WIB
        const userTimeZone = "Asia/Jakarta";
        const now = new Date(new Date().toLocaleString("en-US", { timeZone: userTimeZone }));

        // Jika masih antara 00:00 - 01:59 WIB, gunakan hari sebelumnya
        if (now.getHours() < 2) now.setDate(now.getDate() - 1);

        const tanggal = now.toISOString().split("T")[0]; // Format YYYY-MM-DD

        // Simpan data dengan tanggal eksplisit
        const [result] = await connection.execute(
            'INSERT INTO history (tanggal, jumlah_pemasukan, item, keterangan, category, name, icon) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [tanggal, totalHarga, item, keterangan, category, nama, icon]
        );

        return new Response(JSON.stringify({ message: "Data berhasil disimpan", result }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Gagal menyimpan data", details: error.message }), { status: 500 });
    }
}
