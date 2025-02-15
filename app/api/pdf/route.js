import PDFDocument from "pdfkit";
import { dbConnect } from "@/lib/db"; // koneksi database
import { NextResponse } from "next/server";

export async function GET() {
    try {

        const connection = await dbConnect();
        const [rows] = await connection.execute("SELECT * FROM menu");
        await connection.end();

        const doc = new PDFDocument();
        let buffers = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
            const pdfData = Buffer.concat(buffers);

            return new NextResponse(pdfData, {
                status: 200,
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": "attachment; filename=menu.pdf",
                },
            });
        });

        // Menambahkan header
        doc.rect(0, 0, 600, 80).fill("#3498db");
        doc.fillColor("white").fontSize(20).text("Daftar Menu Restoran", 50, 30);

        // Menambahkan tabel menu
        let y = 120;
        doc.fillColor("black").fontSize(14);
        doc.text("No", 50, y);
        doc.text("Nama Menu", 120, y);
        doc.text("Harga (Rp)", 300, y);
        doc.text("Dose", 400, y);
        doc.text("Category", 500, y);
        doc.moveTo(50, y + 20).lineTo(550, y + 20).stroke();
        y += 30;

        rows.forEach((item, index) => {
            doc.text(index + 1, 50, y);
            doc.text(item.name, 120, y);
            doc.text(item.price, 300, y);
            doc.text(item.dose, 400, y);
            doc.text(item.category, 500, y);
            y += 25;
        });

        doc.end();
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
