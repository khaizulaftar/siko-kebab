import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";
import moment from "moment-timezone";

export async function GET() {
    try {
        const db = await dbConnect();
        const [rows] = await db.execute("SELECT * FROM history");

        if (!rows.length) {
            return NextResponse.json({ message: "Tidak ada history" }, { status: 404 });
        }

        // Ambil tanggal sekarang dalam zona waktu WIB
        const userTimeZone = "Asia/Jakarta";
        let now = moment().tz(userTimeZone);

        // Jika masih antara 00:00 - 01:59 WIB, anggap masih hari sebelumnya
        if (now.hour() < 2) now.subtract(1, "day");

        const groupedHistory = rows.reduce((acc, value) => {
            const formattedDate = moment(value.tanggal).locale("id").format("dddd, DD MMMM YYYY");

            if (!acc[formattedDate]) acc[formattedDate] = [];
            acc[formattedDate].push(value);
            return acc;
        }, {});

        return NextResponse.json(groupedHistory);
    } catch (error) {
        return NextResponse.json({ error: "Gagal mengambil data", details: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { totalHarga, item, keterangan, category, nama, icon } = await req.json();
        if (!totalHarga || !item || !category || !nama) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
        }

        const db = await dbConnect();

        // Ambil tanggal sekarang dalam zona waktu WIB menggunakan moment-timezone
        const userTimeZone = "Asia/Jakarta";
        let now = moment().tz(userTimeZone);

        // Jika masih antara 00:00 - 01:59 WIB, anggap masih hari sebelumnya
        if (now.hour() < 2) now.subtract(1, "day");

        const tanggal = now.format("YYYY-MM-DD"); // Format YYYY-MM-DD

        // Simpan data dengan tanggal eksplisit
        const [result] = await db.execute(
            "INSERT INTO history (tanggal, jumlah_pemasukan, item, keterangan, category, name, icon) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [tanggal, totalHarga, item, keterangan || "", category, nama, icon || ""]
        );

        return NextResponse.json({ message: "Data berhasil disimpan", result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Gagal menyimpan data", details: error.message }, { status: 500 });
    }
}
