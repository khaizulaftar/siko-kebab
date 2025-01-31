import { dbConnect } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const db = await dbConnect();
        const [rows] = await db.execute('SELECT * FROM ingredients');

        if (!rows.length) {
            return NextResponse.json({ message: 'Menu kosong' }, { status: 404 });
        }
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}