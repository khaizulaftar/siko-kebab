import { dbConnect } from '@/lib/db'
import { NextResponse } from 'next/server'
import moment from "moment-timezone";

export async function GET() {
    try {
        const db = await dbConnect()
        const [rows] = await db.execute('SELECT * FROM ingredients')
        return NextResponse.json(rows.length ? rows : { message: 'Menu kosong' }, { status: rows.length ? 200 : 404 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// export async function PUT(req) {
//     try {
//         const { id, stock, price } = await req.json()
//         if (!id || (stock === undefined && price === undefined)) {
//             return NextResponse.json({ message: 'ID dan salah satu dari stock atau price diperlukan' }, { status: 400 })
//         }

//         const db = await dbConnect()
//         const today = new Date().toISOString().split('T')[0]

//         const [[existing]] = await db.execute(
//             'SELECT stock, initial_stock, final_stock, out_stock, tanggal, price FROM ingredients WHERE id = ?',
//             [id]
//         )

//         if (!existing) {
//             return NextResponse.json({ message: 'Menu tidak ditemukan' }, { status: 404 })
//         }

//         let { stock: currentStock, initial_stock: initialStock, tanggal: lastUpdatedDate, price: currentPrice } = existing
//         let finalStock = existing.final_stock || 0
//         let outStock = existing.out_stock || 0

//         // Update stok jika diberikan
//         if (stock !== undefined) {
//             if (lastUpdatedDate !== today) {
//                 initialStock = currentStock
//             }

//             if (stock > currentStock) {
//                 finalStock += stock - currentStock
//             } else if (stock < currentStock) {
//                 outStock += currentStock - stock
//             }
//         }

//         // Update harga jika diberikan
//         const newPrice = price !== undefined ? price : currentPrice

//         const [result] = await db.execute(
//             'UPDATE ingredients SET stock = ?, initial_stock = ?, final_stock = ?, out_stock = ?, price = ?, tanggal = ? WHERE id = ?',
//             [stock ?? currentStock, initialStock, finalStock, outStock, newPrice, today, id]
//         )

//         return NextResponse.json({
//             message: result.affectedRows ? 'Data berhasil diperbarui' : 'Menu tidak ditemukan',
//             data: { stock, initialStock, finalStock, outStock, price: newPrice, tanggal: today }
//         }, { status: result.affectedRows ? 200 : 404 })

//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 })
//     }
// }
export async function POST(req) {
    try {
        const { name, dose, stock, price } = await req.json();

        if (!name || !dose || !stock || !price) {
            return NextResponse.json(
                { message: "Semua field diperlukan" },
                { status: 400 }
            );
        }

        const db = await dbConnect();
        const [result] = await db.execute(
            "INSERT INTO ingredients (name, dose, stock, price) VALUES (?, ?, ?, ?)",
            [name, dose, stock, price]
        );

        return NextResponse.json(
            {
                message: "Menu berhasil ditambahkan",
                data: {
                    id: result.insertId,
                    name,
                    dose,
                    stock,
                    price,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const { id, stock, price } = await req.json();

        if (!id || (stock === undefined && price === undefined)) {
            return NextResponse.json(
                { message: "ID dan salah satu dari stock atau price diperlukan" },
                { status: 400 }
            );
        }

        const db = await dbConnect();

        // Gunakan waktu Jakarta (WIB) dan cek apakah sudah lewat jam 2 pagi
        const now = moment().tz("Asia/Jakarta");
        const today = now.format("YYYY-MM-DD"); // Tanggal hari ini
        const resetTime = moment().tz("Asia/Jakarta").startOf("day").add(4, "hours"); // Jam 4 pagi

        // Jika sekarang masih sebelum jam 4 pagi, gunakan tanggal kemarin
        const effectiveDate = now.isBefore(resetTime)
            ? moment().tz("Asia/Jakarta").subtract(1, "day").format("YYYY-MM-DD")
            : today;

        // Ambil data stok saat ini dari database
        const [[existing]] = await db.execute(
            "SELECT stock, initial_stock, final_stock, out_stock, tanggal, price FROM ingredients WHERE id = ?",
            [id]
        );

        if (!existing) {
            return NextResponse.json(
                { message: "Menu tidak ditemukan" },
                { status: 404 }
            );
        }

        let {
            stock: currentStock,
            initial_stock: initialStock,
            final_stock: finalStock,
            out_stock: outStock,
            tanggal: lastUpdatedDate,
            price: currentPrice,
        } = existing;

        // Jika tanggal terakhir update bukan tanggal efektif, reset stok awal, masuk, dan habis
        if (lastUpdatedDate !== effectiveDate) {
            initialStock = currentStock; // Stok awal = stok akhir hari sebelumnya
            finalStock = 0; // Reset stok masuk
            outStock = 0; // Reset stok habis
        }

        // Update stok jika diberikan
        if (stock !== undefined) {
            if (stock > currentStock) {
                finalStock += stock - currentStock; // Tambah stok masuk
            } else if (stock < currentStock) {
                outStock += currentStock - stock; // Tambah stok habis
            }
            currentStock = stock; // Update stok saat ini
        }

        // Update harga jika diberikan
        const newPrice = price !== undefined ? price : currentPrice;

        // Simpan perubahan ke database
        const [result] = await db.execute(
            "UPDATE ingredients SET stock = ?, initial_stock = ?, final_stock = ?, out_stock = ?, price = ?, tanggal = ? WHERE id = ?",
            [currentStock, initialStock, finalStock, outStock, newPrice, effectiveDate, id]
        );

        return NextResponse.json(
            {
                message: result.affectedRows ? "Data berhasil diperbarui" : "Menu tidak ditemukan",
                data: {
                    stock: currentStock,
                    initialStock,
                    finalStock,
                    outStock,
                    price: newPrice,
                    tanggal: effectiveDate,
                },
            },
            { status: result.affectedRows ? 200 : 404 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { message: "ID diperlukan" },
                { status: 400 }
            );
        }

        const db = await dbConnect();
        const [result] = await db.execute(
            "DELETE FROM ingredients WHERE id = ?",
            [id]
        );

        return NextResponse.json(
            {
                message: result.affectedRows ? "Menu berhasil dihapus" : "Menu tidak ditemukan",
            },
            { status: result.affectedRows ? 200 : 404 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}