import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

// export async function GET(req) {
//     try {
//         const { searchParams } = new URL(req.url);
        
//         // Ambil tanggal dengan zona waktu WIB
//         const userTimeZone = "Asia/Jakarta";
//         const now = new Date(new Date().toLocaleString("en-US", { timeZone: userTimeZone }));

//         // Jika masih antara 00:00 - 01:59 WIB, anggap masih hari sebelumnya
//         if (now.getHours() < 2) now.setDate(now.getDate() - 1);

//         const tanggalRaw = searchParams.get("tanggal") || now.toISOString().split("T")[0];

//         // Format tanggal untuk tampilan
//         const [year, month, day] = tanggalRaw.split("-").map(Number);
//         const formattedTanggal = new Intl.DateTimeFormat("id-ID", {
//             weekday: "long",
//             day: "2-digit",
//             month: "long",
//             year: "numeric"
//         }).format(new Date(year, month - 1, day));

//         const connection = await dbConnect();

//         const [[pemasukanRows], [kebabRows], [burgerRows], [minumanRows]] = await Promise.all([
//             connection.query("SELECT SUM(jumlah_pemasukan) AS total_pemasukan FROM income WHERE tanggal = ?", [tanggalRaw]),
//             connection.query("SELECT SUM(item) AS total_kebab FROM income WHERE tanggal = ? AND category = 'kebab'", [tanggalRaw]),
//             connection.query("SELECT SUM(item) AS total_burger FROM income WHERE tanggal = ? AND category = 'burger'", [tanggalRaw]),
//             connection.query("SELECT SUM(item) AS total_minuman FROM income WHERE tanggal = ? AND category = 'minuman'", [tanggalRaw])
//         ]);

//         return NextResponse.json({
//             success: true,
//             data: {
//                 tanggal: formattedTanggal,
//                 total_pemasukan: pemasukanRows[0]?.total_pemasukan || 0,
//                 total_kebab: kebabRows[0]?.total_kebab || 0,
//                 total_burger: burgerRows[0]?.total_burger || 0,
//                 total_minuman: minumanRows[0]?.total_minuman || 0
//             }
//         });

//     } catch (error) {
//         return NextResponse.json(
//             { success: false, error: "Gagal mengambil data", details: error.message },
//             { status: 500 }
//         );
//     }
// }

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        
        // Ambil tanggal dengan zona waktu WIB
        const userTimeZone = "Asia/Jakarta";
        const now = new Date(new Date().toLocaleString("en-US", { timeZone: userTimeZone }));

        // Jika masih antara 00:00 - 01:59 WIB, anggap masih hari sebelumnya
        if (now.getHours() < 2) now.setDate(now.getDate() - 1);

        const tanggalRaw = searchParams.get("tanggal") || now.toISOString().split("T")[0];

        // Format tanggal untuk tampilan
        const [year, month, day] = tanggalRaw.split("-").map(Number);
        const formattedTanggal = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }).format(new Date(year, month - 1, day));

        const connection = await dbConnect();

        const [[pemasukanRows], [nonTunaiRows], [tunaiRows], [kebabRows], [burgerRows], [minumanRows]] = await Promise.all([
            connection.query("SELECT SUM(jumlah_pemasukan) AS total_pemasukan FROM income WHERE tanggal = ?", [tanggalRaw]),
            connection.query("SELECT SUM(jumlah_pemasukan) AS total_non_tunai FROM income WHERE tanggal = ? AND category = 'Non Tunai'", [tanggalRaw]),
            connection.query("SELECT SUM(jumlah_pemasukan) AS total_tunai FROM income WHERE tanggal = ? AND category != 'Non Tunai'", [tanggalRaw]),
            connection.query("SELECT SUM(item) AS total_kebab FROM income WHERE tanggal = ? AND category = 'kebab'", [tanggalRaw]),
            connection.query("SELECT SUM(item) AS total_burger FROM income WHERE tanggal = ? AND category = 'burger'", [tanggalRaw]),
            connection.query("SELECT SUM(item) AS total_minuman FROM income WHERE tanggal = ? AND category = 'minuman'", [tanggalRaw])
        ]);

        return NextResponse.json({
            success: true,
            data: {
                tanggal: formattedTanggal,
                total_pemasukan: pemasukanRows[0]?.total_pemasukan || 0,
                total_non_tunai: nonTunaiRows[0]?.total_non_tunai || 0, // Pemasukan Non Tunai
                total_tunai: tunaiRows[0]?.total_tunai || 0, // Pemasukan Tunai (Total - Non Tunai)
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
        const { totalHarga, item, category, nama } = await req.json();

        const connection = await dbConnect();

        // Simpan data tanpa modifikasi waktu, biarkan MySQL menangani timestamp
        const [result] = await connection.execute(
            'INSERT INTO income (jumlah_pemasukan, item, category, name) VALUES (?, ?, ?, ?)',
            [totalHarga, item, category, nama]
        );

        return new Response(JSON.stringify({ message: "Data berhasil disimpan", result }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Gagal menyimpan data", details: error.message }), { status: 500 });
    }
}
