import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, "SECRET");

        const db = await dbConnect();
        const [users] = await db.query("SELECT username, role FROM users WHERE username = ?", [decoded.username]);

        if (users.length === 0) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json({ user: users[0] });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "ID tidak boleh kosong" }, { status: 400 });
        }

        // Pastikan mendapatkan koneksi database
        const db = await dbConnect();
        const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ message: "User berhasil dihapus" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ message: "Terjadi kesalahan pada server", error }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { username, password, role } = await req.json();

        if (!username || !password || !role) {
            return NextResponse.json({ message: "Semua kolom harus diisi" }, { status: 400 });
        }

        const db = await dbConnect();
        

        const [result] = await db.query(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            [username, password, role]
        )

        return NextResponse.json(
            { message: "User berhasil ditambahkan", id: result.insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error saat menambahkan user:", error);
        return NextResponse.json({ message: "Terjadi kesalahan pada server", error }, { status: 500 });
    }
}