import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const connection = await dbConnect();

        const [rows] = await connection.query(`
            SELECT DATE_FORMAT(tanggal, '%Y-%m-%d') as tanggal, category, SUM(item) as total_item
            FROM income
            GROUP BY tanggal, category
            ORDER BY tanggal ASC
        `);

        const [totalIncomeRows] = await connection.query(`
            SELECT DATE_FORMAT(tanggal, '%Y-%m-%d') as tanggal, SUM(jumlah_pemasukan) as total_pemasukan
            FROM income
            GROUP BY tanggal
            ORDER BY tanggal ASC
        `);

        const result = {
            tanggal: [],
            hari: {},
            total_pemasukan: [],
            total_kebab: [],
            total_burger: [],
            total_minuman: []
        };

        // Ambil jumlah hari terakhir yang diinginkan
        const today = new Date();
        const lastDays = Array.from({ length: 14 }, (_, i) => {
            const date = new Date();
            date.setDate(today.getDate() - i);
            return date;
        }).reverse();

        lastDays.forEach(dateObj => {
            const formattedDate = dateObj.toISOString().split('T')[0];
            const dayName = dateObj.toLocaleDateString('id-ID', { weekday: 'short' });

            result.tanggal.push(formattedDate);
            result.hari[formattedDate] = dayName;

            const pemasukanData = totalIncomeRows.find(row => row.tanggal === formattedDate);
            result.total_pemasukan.push(pemasukanData ? pemasukanData.total_pemasukan : 0);

            const kebabData = rows.find(row => row.tanggal === formattedDate && row.category === 'kebab');
            const burgerData = rows.find(row => row.tanggal === formattedDate && row.category === 'burger');
            const minumanData = rows.find(row => row.tanggal === formattedDate && row.category === 'minuman');

            result.total_kebab.push(kebabData ? kebabData.total_item : 0);
            result.total_burger.push(burgerData ? burgerData.total_item : 0);
            result.total_minuman.push(minumanData ? minumanData.total_item : 0);
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