import { dbConnect } from "@/lib/db"
import { NextResponse } from "next/server"
import moment from "moment-timezone"

export async function GET() {
    try {
        const db = await dbConnect()
        const [rows] = await db.execute("SELECT * FROM history")

        if (!rows.length) {
            return NextResponse.json({ message: "Tidak ada history" }, { status: 404 })
        }

        const userTimeZone = "Asia/Jakarta"
        let now = moment().tz(userTimeZone)

        if (now.hour() < 4) now.subtract(1, "day")

        const groupedHistory = rows.reduce((acc, value) => {
            const formattedDate = moment(value.tanggal).locale("id").format("dddd, DD MMMM YYYY")

            if (!acc[formattedDate]) acc[formattedDate] = []
            acc[formattedDate].push(value)
            return acc
        }, {})

        return NextResponse.json(groupedHistory)
    } catch (error) {
        return NextResponse.json({ error: "Gagal mengambil data", details: error.message }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const { totalHarga, item, keterangan, category, nama, icon } = await req.json()

        const db = await dbConnect()

        const userTimeZone = "Asia/Jakarta"
        let now = moment().tz(userTimeZone)

        if (now.hour() < 4) now.subtract(1, "day")

        const tanggal = now.format("YYYY-MM-DD")

        const [result] = await db.execute(
            "INSERT INTO history (tanggal, jumlah_pemasukan, item, keterangan, category, name, icon) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [tanggal, totalHarga ?? null, item ?? null, keterangan || "", category, nama, icon || ""]
        )

        return NextResponse.json({ message: "Data berhasil disimpan", result }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Gagal menyimpan data", details: error.message }, { status: 500 })
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json()
        const db = await dbConnect()

        const [result] = await db.execute("DELETE FROM history WHERE id = ?", [id])

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 })
        }

        return NextResponse.json({ message: "Data berhasil dihapus" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Gagal menghapus data", details: error.message }, { status: 500 })
    }
}