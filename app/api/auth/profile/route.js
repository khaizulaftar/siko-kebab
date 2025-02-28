import { dbConnect } from "@/lib/db"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(req) {
    try {
        const authHeader = req.headers.get("Authorization")
        if (!authHeader) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, "SECRET")

        const db = await dbConnect()
        const [users] = await db.query("SELECT username, password, role FROM users WHERE username = ?", [decoded.username])

        if (users.length === 0) return NextResponse.json({ message: "User not found" }, { status: 404 })

        return NextResponse.json({ user: users[0] })
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json()

        if (!id) {
            return NextResponse.json({ message: "ID tidak boleh kosong" }, { status: 400 })
        }

        const db = await dbConnect()
        const [result] = await db.query("DELETE FROM users WHERE id = ?", [id])

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 })
        }

        return NextResponse.json({ message: "User berhasil dihapus" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Terjadi kesalahan pada server", error }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const { username, password, role } = await req.json()

        if (!username || !password || !role) {
            return NextResponse.json({ message: "Semua kolom harus diisi" }, { status: 400 })
        }

        const db = await dbConnect()
        
        const [result] = await db.query(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            [username, password, role]
        )

        return NextResponse.json(
            { message: "User berhasil ditambahkan", id: result.insertId },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json({ message: "Terjadi kesalahan pada server", error }, { status: 500 })
    }
}

export async function PUT(req) {
    try {
        const { username, password } = await req.json()
        const token = req.headers.get("Authorization")
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const decoded = jwt.verify(token.split(" ")[1], "SECRET")
        const oldUsername = decoded.username

        const db = await dbConnect()

        // Debug: Cek apakah user lama ada
        const [userExists] = await db.query("SELECT * FROM users WHERE username = ?", [oldUsername])
        if (userExists.length === 0) {
            return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 })
        }

        const [result] = await db.query(
            "UPDATE users SET username = ?, password = ? WHERE username = ?",
            [username, password, oldUsername]
        )

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "Gagal memperbarui profil" }, { status: 400 })
        }

        const newToken = jwt.sign({ username }, "SECRET", { expiresIn: "1h" })

        return NextResponse.json({ message: "Profil berhasil diperbarui", token: newToken }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Terjadi kesalahan pada server", error }, { status: 500 })
    }
}