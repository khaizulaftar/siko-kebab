import { dbConnect } from "@/lib/db"
import { NextResponse } from "next/server"
import moment from "moment-timezone"

export async function GET() {
    try {
        const connection = await dbConnect()

        const [rows] = await connection.query(`
            SELECT DATE_FORMAT(tanggal, '%Y-%m-%d') as tanggal, category, SUM(item) as total_item
            FROM income
            GROUP BY tanggal, category
            ORDER BY tanggal ASC
        `)

        // Modified query to get both tunai and non-tunai totals
        const [totalIncomeRows] = await connection.query(`
            SELECT 
                DATE_FORMAT(tanggal, '%Y-%m-%d') as tanggal, 
                SUM(CASE WHEN category != 'Non Tunai' THEN jumlah_pemasukan ELSE 0 END) as total_tunai,
                SUM(CASE WHEN category = 'Non Tunai' THEN jumlah_pemasukan ELSE 0 END) as total_non_tunai
            FROM income
            GROUP BY tanggal
            ORDER BY tanggal ASC
        `)

        const result = {
            tanggal: [],
            hari: {},
            total_pemasukan: [], // Now will be (tunai - non_tunai)
            total_kebab: [],
            total_burger: [],
            total_minuman: []
        }

        const userTimeZone = "Asia/Jakarta"
        const today = moment().tz(userTimeZone)

        const lastDays = Array.from({ length: 14 }, (_, i) => {
            let date = today.clone().subtract(i, "days")
            if (date.hour() < 4) date.subtract(1, "day")
            return date
        }).reverse()

        lastDays.forEach(dateObj => {
            const formattedDate = dateObj.format("YYYY-MM-DD")
            const dayName = dateObj.locale("id").format("ddd")

            result.tanggal.push(formattedDate)
            result.hari[formattedDate] = dayName

            // Calculate tunai - non_tunai
            const incomeData = totalIncomeRows.find(row => row.tanggal === formattedDate)
            const tunai = incomeData?.total_tunai || 0
            const nonTunai = incomeData?.total_non_tunai || 0
            result.total_pemasukan.push(tunai - nonTunai)

            const kebabData = rows.find(row => row.tanggal === formattedDate && row.category.toLowerCase() === "kebab")
            const burgerData = rows.find(row => row.tanggal === formattedDate && row.category.toLowerCase() === "burger")
            const minumanData = rows.find(row => row.tanggal === formattedDate && row.category.toLowerCase() === "minuman")

            result.total_kebab.push(kebabData ? kebabData.total_item : 0)
            result.total_burger.push(burgerData ? burgerData.total_item : 0)
            result.total_minuman.push(minumanData ? minumanData.total_item : 0)
        })

        return NextResponse.json({
            success: true,
            data: result
        })

    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Gagal mengambil data", details: error.message }, 
            { status: 500 }
        )
    }
}