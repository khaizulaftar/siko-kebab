"use client";
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function NonTunai() {
    const [totalHarga, setTotalHarga] = useState("");
    const [loading, setLoading] = useState(false); // State untuk tombol

    const handleSubmit = async () => {
        if (!totalHarga) {
            Swal.fire("Oops!", "Masukkan jumlah pemasukan", "warning");
            return;
        }

        setLoading(true); // Disable tombol

        const numericValue = totalHarga.replace(/\D/g, ""); // Hanya angka sebelum dikirim
        const data = {
            totalHarga: numericValue,
            item: "Item 1",
            category: "Non Tunai",
            nama: "No Tunai",
        };

        try {
            await axios.post("/api/income", data);
            Swal.fire("Berhasil!", "Data berhasil dikirim", "success");
            setTotalHarga("");
        } catch (error) {
            Swal.fire("Gagal!", "Terjadi kesalahan saat mengirim data", "error");
        } finally {
            setLoading(false); // Enable tombol lagi setelah selesai
        }
    };

    return (
        <div className="space-y-4 p-6 rounded-3xl bg-white">
            <span className="font-medium text-sm text-gray-700">Pemasukan non-tunai</span>
            <input 
                type="text" 
                placeholder="Jumlah Pemasukan" 
                value={totalHarga} 
                onChange={(e) => setTotalHarga(
                    new Intl.NumberFormat("id-ID").format(Number(e.target.value.replace(/\D/g, "")))
                )} 
                required 
                className="bg-gray-50 rounded-lg border border-blue-600 px-5 py-2 text-gray-600 focus:ring focus:outline-none focus:ring-blue-300 focus:border-blue-300 focus:ring-opacity-802 w-full" 
            />
            <button 
                onClick={handleSubmit} 
                disabled={loading} 
                className={`p-2 w-full rounded-lg text-sm text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            >
                {loading ? "Mengirim..." : "Kirim"}
            </button>
        </div>
    );
}
