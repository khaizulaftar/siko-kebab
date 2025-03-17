import { dbConnect } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const db = await dbConnect();

        // Ambil semua data income
        const [rows] = await db.execute("SELECT * FROM income ORDER BY tanggal DESC");

        // Kelompokkan data berdasarkan tanggal
        const groupedData = rows.reduce((acc, item) => {
            const tanggal = item.tanggal; // Ambil tanggal dari data
            if (!acc[tanggal]) {
                acc[tanggal] = []; // Buat array baru untuk tanggal tersebut
            }
            acc[tanggal].push(item); // Tambahkan item ke array tanggal yang sesuai
            return acc;
        }, {});

        // Ubah objek groupedData menjadi array
        const result = Object.keys(groupedData).map((tanggal) => ({
            tanggal,
            items: groupedData[tanggal],
        }));

        // Jika ada data, kembalikan data dengan status 200
        if (result.length > 0) {
            return NextResponse.json(
                {
                    success: true,
                    data: result,
                    message: "Data berhasil diambil",
                },
                { status: 200 }
            );
        }

        // Jika tidak ada data, kembalikan pesan dengan status 404
        return NextResponse.json(
            {
                success: false,
                message: "Tidak ada data income",
            },
            { status: 404 }
        );
    } catch (error) {
        // Jika terjadi error, kembalikan pesan error dengan status 500
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                message: "Gagal mengambil data income",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const db = await dbConnect();
        const { id } = await request.json();

        // Hapus data income berdasarkan ID
        const [result] = await db.execute("DELETE FROM income WHERE id = ?", [id]);

        if (result.affectedRows > 0) {
            return NextResponse.json(
                {
                    success: true,
                    message: "Data berhasil dihapus",
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Data tidak ditemukan",
            },
            { status: 404 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                message: "Gagal menghapus data income",
            },
            { status: 500 }
        );
    }
}