import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";
import moment from "moment-timezone";

export async function GET(req) {
    try {
        const connection = await dbConnect();
        const url = new URL(req.url);

        const userTimeZone = "Asia/Jakarta";
        const now = moment().tz(userTimeZone);
        const minDate = url.searchParams.get("min") || now.format("YYYY-MM-DD");
        const maxDate = url.searchParams.get("max") || now.format("YYYY-MM-DD");

        // Menambahkan kondisi untuk hanya mengambil history yang berhubungan dengan penjualan dalam rentang tanggal
        const [rows] = await connection.execute(
            `SELECT 
                category, 
                name, 
                GROUP_CONCAT(DISTINCT keterangan ORDER BY id ASC SEPARATOR ', ') AS keterangan, 
                SUM(item) AS total_item, 
                SUM(jumlah_pemasukan) AS jumlah_pemasukan 
            FROM history 
            WHERE DATE(tanggal) BETWEEN ? AND ? 
            AND keterangan LIKE '%Terjual%'  -- Kondisi untuk hanya mengambil history penjualan
            GROUP BY category, name 
            ORDER BY category ASC, name ASC`,
            [minDate, maxDate]
        );
        
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: "Database connection failed", details: error.message }, { status: 500 });
    }
}