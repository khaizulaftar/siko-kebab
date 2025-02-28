import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req) {
    try {
        const { menu_name, count } = await req.json()
        const db = await dbConnect()

        const [menuData] = await db.execute(`SELECT composition FROM menu WHERE name = ?`, [menu_name])
        
        if (menuData.length === 0 || !menuData[0].composition) {
            return NextResponse.json({ error: "Menu tidak ditemukan atau tidak memiliki komposisi" }, { status: 404 })
        }

        const ingredientsToUpdate = JSON.parse(menuData[0].composition)

        for (const [ingredientName, qty] of Object.entries(ingredientsToUpdate)) {
            const updateQuery = `
                UPDATE ingredients 
                SET stock = stock - (? * ?), 
                    out_stock = out_stock + (? * ?) 
                WHERE name = ?
            `
            await db.execute(updateQuery, [count, qty, count, qty, ingredientName])
        }

        return NextResponse.json({ message: "Stok berhasil dikurangi" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
    }
}