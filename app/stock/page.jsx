"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Stock() {
    const [menus, setMenus] = useState([]);
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const inputRefs = useRef({});
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        axios
            .get("/api/stockSet")
            .then(({ data }) => {
                setMenus(data);
                setFilteredMenus(data); // Initially, show all items
            })
            .catch(() => {
                Swal.fire({
                    title: "The Internet?",
                    text: "Gagal mengambil data",
                    icon: "question"
                });
            });
    }, []);

    // Fungsi untuk memformat angka dengan titik sebagai pemisah ribuan
    const formatNumber = (number) => {
        return new Intl.NumberFormat("id-ID").format(number);
    };

    const handlePriceChange = async (id, name) => {
        const newStock = inputRefs.current[id]?.value.replace(/\./g, ""); // Hapus titik sebelum konversi ke angka
        const stockInt = Math.floor(Number(newStock));

        if (isNaN(stockInt) || stockInt <= 0) {
            return Swal.fire({
                icon: "error",
                title: "Harga tidak valid",
                text: "Harap masukkan harga yang valid.",
            });
        }

        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Harga akan diubah!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, ubah harga",
            cancelButtonText: "Batal",
        });

        if (!result.isConfirmed) return;

        setMenus(menus.map((menu) =>
            menu.id === id ? { ...menu, loading: true } : menu
        ));

        try {
            await axios.put("/api/stockSet", { id, stock: stockInt });

            await axios.post("/api/history", {
                totalHarga: stockInt,
                item: "change",
                category: name,
                nama: "",
                icon: "https://img.icons8.com/pulsar-line/50/change.png"
            });

            setMenus(menus.map((menu) =>
                menu.id === id ? { ...menu, stock: stockInt, loading: false } : menu
            ));
            setEditingId(null);

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Harga telah diperbarui dan riwayat tersimpan.",
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal memperbarui harga",
                text: "Silakan coba lagi.",
            });

            setMenus(menus.map((menu) =>
                menu.id === id ? { ...menu, loading: false } : menu
            ));
        }
    };

    // Handle the search query change
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter menus based on the search query
        const filtered = menus.filter(menu => menu.name.toLowerCase().includes(query));
        setFilteredMenus(filtered);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="m-6">
                {/* Search Input */}
                <div className="my-6">
                    <input
                        type="text"
                        className="w-full px-6 py-3 border rounded-full"
                        placeholder="Cari berdasarkan nama"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mb-24">
                    {filteredMenus.map(({ id, name, stock, dose, initial_stock, final_stock, out_stock, loading }) => (
                        <div key={id} className="p-6 flex flex-col gap-2 border rounded-xl bg-white shadow-sm">
                            <span className="font-bold text-xl">{name}</span>
                            <div className="flex flex-col text-center items-center">
                                <span className="capitalize font-bold">jumlah Stock</span>
                                <div className="flex gap-2">
                                    <span className="font-bold text-xl">{formatNumber(stock)}</span>
                                    <span className="text-xl">|</span>
                                    <span className="text-xl capitalize">{dose}</span>
                                </div>
                                {editingId === id ? (
                                    <div className="relative mt-6 w-full">
                                        <input
                                            type="text"
                                            className="block w-full p-4 text-sm border rounded-lg"
                                            placeholder="Ubah harga barang"
                                            ref={(el) => (inputRefs.current[id] = el)}
                                            onInput={(e) => {
                                                let value = e.target.value.replace(/\D/g, ""); // Hanya angka
                                                e.target.value = formatNumber(value);
                                            }}
                                        />
                                        <button
                                            onClick={() => handlePriceChange(id, name)}
                                            disabled={loading}
                                            className={`absolute end-2.5 bottom-2.5 bg-blue-700 text-white rounded-full text-sm px-4 py-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            {loading ? "Memperbarui..." : "Ubah Harga"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex w-full justify-end my-6">
                                        <button onClick={() => setEditingId(id)}>
                                            <span className="text-blue-600 text-md capitalize">ubah</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm capitalize">stok awal</span>
                                    <div className="flex gap-2">
                                        <span>{formatNumber(initial_stock)}</span>
                                        <span>|</span>
                                        <span>{dose}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm capitalize">jumlah masuk</span>
                                    <div className="flex gap-2">
                                        <span>{formatNumber(final_stock)}</span>
                                        <span>|</span>
                                        <span>{dose}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm capitalize">jumlah habis</span>
                                    <div className="flex gap-2">
                                        <span>{formatNumber(out_stock)}</span>
                                        <span>|</span>
                                        <span>{dose}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
