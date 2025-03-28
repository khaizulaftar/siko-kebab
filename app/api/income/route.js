import { dbConnect } from "@/lib/db"
import { NextResponse } from "next/server"
import moment from "moment-timezone"

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)

        const userTimeZone = "Asia/Jakarta"
        let now = moment().tz(userTimeZone)

        if (now.hour() < 4) now.subtract(1, "day")

        const tanggalRaw = searchParams.get("tanggal") || now.format("YYYY-MM-DD")

        const formattedTanggal = moment(tanggalRaw).locale("id").format("dddd, DD MMMM YYYY")

        const connection = await dbConnect()

        const [[pemasukanRows], [nonTunaiRows], [tunaiRows], [kebabRows], [burgerRows], [minumanRows]] = await Promise.all([
            connection.query("SELECT SUM(jumlah_pemasukan) AS total_pemasukan FROM income WHERE tanggal = ?", [tanggalRaw]),
            connection.query("SELECT SUM(jumlah_pemasukan) AS total_non_tunai FROM income WHERE tanggal = ? AND category = 'Non Tunai'", [tanggalRaw]),
            connection.query("SELECT SUM(jumlah_pemasukan) AS total_tunai FROM income WHERE tanggal = ? AND category != 'Non Tunai'", [tanggalRaw]),
            connection.query("SELECT SUM(item) AS total_kebab FROM income WHERE tanggal = ? AND category = 'kebab'", [tanggalRaw]),
            connection.query("SELECT SUM(item) AS total_burger FROM income WHERE tanggal = ? AND category = 'burger'", [tanggalRaw]),
            connection.query("SELECT SUM(item) AS total_minuman FROM income WHERE tanggal = ? AND category = 'minuman'", [tanggalRaw])
        ])

        return NextResponse.json({
            success: true,
            data: {
                tanggal: formattedTanggal,
                total_pemasukan: (tunaiRows[0]?.total_tunai || 0) - (nonTunaiRows[0]?.total_non_tunai || 0),
                total_non_tunai: nonTunaiRows[0]?.total_non_tunai || 0,
                total_tunai: tunaiRows[0]?.total_tunai || 0,
                total_kebab: kebabRows[0]?.total_kebab || 0,
                total_burger: burgerRows[0]?.total_burger || 0,
                total_minuman: minumanRows[0]?.total_minuman || 0
            }
        })

    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Gagal mengambil data", details: error.message },
            { status: 500 }
        )
    }
}

export async function POST(req) {
    try {
        const { totalHarga, item, category, nama } = await req.json()

        if (!totalHarga || !item || !category || !nama) {
            return new Response(JSON.stringify({ error: "Semua data harus diisi" }), { status: 400 })
        }

        const connection = await dbConnect()
        if (!connection) throw new Error("Gagal terhubung ke database")

        const userTimeZone = "Asia/Jakarta"
        let now = moment().tz(userTimeZone)

        if (now.hour() < 4) now.subtract(1, "day")

        const tanggalWIB = now.format("YYYY-MM-DD")

        const [result] = await connection.execute(
            'INSERT INTO income (jumlah_pemasukan, item, category, name, tanggal) VALUES (?, ?, ?, ?, ?)',
            [totalHarga, item, category, nama, tanggalWIB]
        )

        return new Response(JSON.stringify({ message: "Data berhasil disimpan", result }), { status: 200 })

    } catch (error) {
        return new Response(JSON.stringify({ error: "Gagal menyimpan data", details: error.message }), { status: 500 })
    }
}