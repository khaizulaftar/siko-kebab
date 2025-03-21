import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const db = await dbConnect()

        const [rows] = await db.execute("SELECT * FROM income ORDER BY tanggal DESC")

        const groupedData = rows.reduce((acc, item) => {
            const tanggal = item.tanggal
            if (!acc[tanggal]) {
                acc[tanggal] = []
            }
            acc[tanggal].push(item)
            return acc
        }, {})

        const result = Object.keys(groupedData).map((tanggal) => ({
            tanggal,
            items: groupedData[tanggal],
        }))

        if (result.length > 0) {
            return NextResponse.json(
                {
                    success: true,
                    data: result,
                    message: "Data berhasil diambil",
                },
                { status: 200 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: "Tidak ada data income",
            },
            { status: 404 }
        )
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                message: "Gagal mengambil data income",
            },
            { status: 500 }
        )
    }
}

export async function DELETE(request) {
    try {
        const db = await dbConnect()
        const { id } = await request.json()

        const [result] = await db.execute("DELETE FROM income WHERE id = ?", [id])

        if (result.affectedRows > 0) {
            return NextResponse.json(
                {
                    success: true,
                    message: "Data berhasil dihapus",
                },
                { status: 200 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: "Data tidak ditemukan",
            },
            { status: 404 }
        )
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                message: "Gagal menghapus data income",
            },
            { status: 500 }
        )
    }
}