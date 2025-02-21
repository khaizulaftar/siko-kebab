"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../dashboard/loading";

export default function Setting() {
    const [menus, setMenus] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formattedPrices, setFormattedPrices] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

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
    }, []);

    const handleInputChange = (id, e) => {
        let value = e.target.value.replace(/\D/g, "");
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
        setMenus((prev) =>
            prev.map((m) => (m.id === id ? { ...m, loading: true } : m))
        );

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

            setMenus((prev) =>
                prev.map((m) => (m.id === id ? { ...m, loading: false } : m))
            );
        }
    };

    const saveHistory = async (totalHarga, category, name,) => {
        try {
            await axios.post("/api/history", {
                totalHarga,
                item: "change",
                category,
                nama: name,
                icon: "https://img.icons8.com/ultraviolet/50/settings.png",
            });
        } catch (error) {
            console.error("Gagal menyimpan ke history:", error);
        }
    };

    // Filter berdasarkan pencarian
    const filteredMenus = menus.filter(
        ({ name, category }) =>
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if(filteredMenus.length ===0 ){
        return<Loading/>
    }
    
    return (
        <>
            <div className="max-w-4xl mx-auto">
                {/* Input pencarian */}
                <div className="w-full pb-3 pt-6 bg-[#F9F9FB] sticky top-0 flex items-center">
                    <input
                        type="text"
                        placeholder="Cari berdasarkan kategori, nama"
                        className="mx-4 placeholder-gray-400/70 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mx-4 mt-3 mb-20 sm:mb-6">
                    {filteredMenus.map(({ id, icon, category, name, price, dose, loading }) => (
                        <div key={id} className="p-6 border rounded-3xl bg-white shadow-sm">
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
                                        <span className="text-md">
                                            Rp{new Intl.NumberFormat("id-ID").format(Number(price) || 0)}
                                        </span>
                                        <span className="text-md">|</span>
                                        <span className="text-sm uppercase">{dose}</span>
                                    </div>
                                </div>
                            </div>

                            {editingId === id ? (
                                <div className="relative mt-6">
                                    <input
                                        type="text"
                                        className="block w-full px-6 py-3 text-md border rounded-xl focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                                        placeholder="Ubah harga barang"
                                        value={formattedPrices[id] || ""}
                                        onChange={(e) => handleInputChange(id, e)}
                                    />
                                    <button
                                        onClick={() => handlePriceChange(id, category, name)}
                                        disabled={loading}
                                        className={`absolute end-1.5 bottom-1.5 bg-blue-700 text-white rounded-full text-sm px-3 py-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {loading ? "Memperbarui..." : "Ubah Harga"}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex mt-6 justify-end">
                                    <button
                                        className="capitalize text-blue-600 text-md"
                                        onClick={() => setEditingId(id)}
                                    >
                                        ubah
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
