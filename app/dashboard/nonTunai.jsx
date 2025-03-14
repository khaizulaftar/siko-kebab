"use client";
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function NonTunai() {
    const [loading, setLoading] = useState(false);

    const handleOpenModal = () => {
        Swal.fire({
            title: "Masukkan Pemasukan Non-Tunai",
            input: "text",
            inputPlaceholder: "Masukkan jumlah",
            inputAttributes: { autocapitalize: "off" },
            showCancelButton: true,
            confirmButtonText: "Kirim",
            cancelButtonText: "Batal",
            inputValidator: (value) => {
                if (!value) {
                    return "Jumlah harus diisi!";
                }
                if (!/^\d+$/.test(value.replace(/\D/g, ""))) {
                    return "Masukkan angka yang valid!";
                }
            },
            didOpen: () => {
                const input = Swal.getInput();
                input.addEventListener("input", (e) => {
                    let numValue = e.target.value.replace(/\D/g, ""); // Ambil angka saja
                    e.target.value = Number(numValue).toLocaleString("id-ID"); // Format ke ribuan
                });
            },
            preConfirm: (value) => Number(value.replace(/\D/g, "")),
        }).then((result) => {
            if (result.isConfirmed) {
                handleSubmit(result.value);
            }
        });
    };

    const handleSubmit = async (totalHarga) => {
        setLoading(true);

        const data = {
            totalHarga,
            item: "Item 1",
            category: "Non Tunai",
            nama: "Non Tunai",
        };

        try {
            await axios.post("/api/income", data);
            Swal.fire("Berhasil!", "Data berhasil dikirim", "success");
        } catch (error) {
            Swal.fire("Gagal!", "Terjadi kesalahan saat mengirim data", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleOpenModal}
            disabled={loading}
            className={`w-full flex justify-between items-center py-4 px-12 hover:px-20 transition rounded-t-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 transition hover:bg-blue-600"}`}
        >
            <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
                <span className="text-sm font-semibold text-white">Pemasukkan non tunai</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        </button>
    );
}
