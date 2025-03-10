import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const connection = await dbConnect();

        const [rows] = await connection.query(`
            SELECT 
            tanggal, category, SUM(item) as total_item
            FROM income
            GROUP BY tanggal, category
            ORDER BY tanggal ASC
        `);

        const [totalIncomeRows] = await connection.query(`
            SELECT tanggal, SUM(jumlah_pemasukan) as total_pemasukan
            FROM income
            GROUP BY tanggal
            ORDER BY tanggal ASC
        `);

        const result = { tanggal: [], hari: {}, total_pemasukan: [] };

        // Ambil 7 hari terakhir termasuk jika tidak ada data
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(today.getDate() - i);
            return date;
        }).reverse(); // Urutkan dari yang paling lama ke terbaru

        last7Days.forEach(dateObj => {
            const formattedDate = dateObj.toLocaleDateString('id-ID', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            }).replace(/\//g, '-');

            const firstLetterOfDay = dateObj.toLocaleDateString('id-ID', { weekday: 'long' }).slice(0, 3);

            result.tanggal.push(formattedDate);
            result.hari[formattedDate] = firstLetterOfDay;

            // Cek jika ada pemasukan pada tanggal tersebut
            const pemasukanData = totalIncomeRows.find(row => {
                return new Date(row.tanggal).toLocaleDateString('id-ID', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                }).replace(/\//g, '-') === formattedDate;
            });

            result.total_pemasukan.push(pemasukanData ? pemasukanData.total_pemasukan : 0);
        });

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Gagal mengambil data', details: error.message }, 
            { status: 500 }
        );
    }
}