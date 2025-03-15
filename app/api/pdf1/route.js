import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";
import moment from "moment-timezone";

export async function GET(req) {
    try {
        const connection = await dbConnect();
        const url = new URL(req.url);

        // Set waktu zona waktu Asia/Jakarta
        const userTimeZone = "Asia/Jakarta";
        const now = moment().tz(userTimeZone);

        // Ambil tanggal min dan max, atau defaultkan ke hari ini jika tidak ada
        const minDate = url.searchParams.get("min") || now.format("YYYY-MM-DD");
        const maxDate = url.searchParams.get("max") || now.format("YYYY-MM-DD");

        // Query untuk mengambil data berdasarkan rentang tanggal
        const [rows] = await connection.execute(
            `SELECT 
                category, 
                name, 
                GROUP_CONCAT(DISTINCT keterangan ORDER BY id ASC SEPARATOR ', ') AS keterangan, 
                SUM(item) AS total_item, 
                SUM(jumlah_pemasukan) AS jumlah_pemasukan 
            FROM history 
            WHERE DATE(tanggal) BETWEEN ? AND ? 
            GROUP BY category, name 
            ORDER BY category ASC, name ASC`,
            [minDate, maxDate]
        );
        
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: "Database connection failed", details: error.message }, { status: 500 });
    }
}
