"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Setting() {
    const [menus, setMenus] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formattedPrices, setFormattedPrices] = useState({}); // Menyimpan harga yang diformat

    useEffect(() => {
        axios.get("/api/menuSet")
            .then(({ data }) => {
                setMenus(data);
                const initialPrices = data.reduce((acc, { id, price }) => {
                    acc[id] = new Intl.NumberFormat("id-ID").format(price);
                    return acc;
                }, {});
                setFormattedPrices(initialPrices);
            })
            .catch(() => {
                Swal.fire({
                    title: "The Internet?",
                    text: "Gagal mengambil data",
                    icon: "question"
                });
            });
    }, []);

    const handleInputChange = (id, e) => {
        let value = e.target.value.replace(/\D/g, ""); // Hanya angka
        setFormattedPrices((prev) => ({
            ...prev,
            [id]: new Intl.NumberFormat("id-ID").format(value),
        }));
    };

    const handlePriceChange = async (id, category, name) => {
        const price = parseInt(formattedPrices[id].replace(/\./g, ""), 10);

        if (isNaN(price) || price <= 0) {
            Swal.fire({
                icon: "error",
                title: "Terjadi kesalahan",
                text: "Harga tidak valid. Pastikan harga lebih besar dari 0.",
            });
            return;
        }

        const result = await Swal.fire({
            title: "Apakah Anda yakin ingin mengubah harga?",
            text: "Harga akan diperbarui setelah Anda mengonfirmasi.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, ubah harga!",
            cancelButtonText: "Batal",
        });

        if (result.isConfirmed) {
            handleAlertConfirm(id, price, category, name);
        }
    };

    const handleAlertConfirm = async (id, price, category, name) => {
        setMenus((prev) => prev.map((m) => (m.id === id ? { ...m, loading: true } : m)));

        try {
            await axios.put("/api/menuSet", { id, price });

            setMenus((prev) =>
                prev.map((m) => (m.id === id ? { ...m, price, loading: false } : m))
            );

            await saveHistory(price, category, name);

            setEditingId(null);

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Harga telah diperbarui.",
            });
        } catch {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal memperbarui harga. Silakan coba lagi.",
            });

            setMenus((prev) => prev.map((m) => (m.id === id ? { ...m, loading: false } : m)));
        }
    };

    const saveHistory = async (totalHarga, category, name) => {
        try {
            await axios.post("/api/history", {
                totalHarga,
                item: "change",
                category,
                nama: name,
                icon: "https://img.icons8.com/ios/50/settings--v1.png"
            });
        } catch (error) {
            console.error("Gagal menyimpan ke history:", error);
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto mt-32">
                <div className="grid sm:grid-cols-2 gap-3 mx-6">
                    {menus.map(({ id, icon, category, name, price, dose, loading }) => (
                        <div key={id} className="p-6 border rounded-xl bg-white shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <img width="35" height="35" src={icon} alt="hamburger" />
                                    <div className="flex flex-col">
                                        <span className="text-md font-bold capitalize">{category}</span>
                                        <span className="text-sm capitalize">{name}</span>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <span className="text-md capitalize">harga</span>
                                    <div className="flex gap-2 items-center">
                                        <span className="text-md">Rp{new Intl.NumberFormat('id-ID').format(Number(price) || 0)}</span>
                                        <span className="text-md">|</span>
                                        <span className="text-sm uppercase">{dose}</span>
                                    </div>
                                </div>
                            </div>

                            {editingId === id ? (
                                <div className="relative mt-6">
                                    <input
                                        type="text"
                                        className="block w-full p-4 text-sm border rounded-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Ubah harga barang"
                                        value={formattedPrices[id] || ""}
                                        onChange={(e) => handleInputChange(id, e)}
                                    />
                                    <button
                                        onClick={() => handlePriceChange(id, category, name)}
                                        disabled={loading}
                                        className={`absolute end-2.5 bottom-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none rounded-full text-sm px-4 py-2 capitalize ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {loading ? "Memperbarui..." : "Ubah Harga"}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex mt-3 justify-end">
                                    <button
                                        className="justify-end"
                                        onClick={() => setEditingId(id)}
                                    >
                                        <span className="capitalize text-blue-600">ubah</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
