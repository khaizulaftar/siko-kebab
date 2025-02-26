"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../dashboard/loading";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Stock() {
    const [menus, setMenus] = useState([]);
    const [filteredMenus, setFilteredMenus] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const inputRefs = useRef({});
    const [editingId, setEditingId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/login");
        } else {
            setIsAuthenticated(true);
        }

        axios.get("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setUser(response.data.user || {}))

        axios
            .get("/api/stockSet")
            .then(({ data }) => {
                setMenus(data);
                setFilteredMenus(data)
            })

    }, [router]);

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
                category: "",
                nama: name,
                icon: "https://img.icons8.com/ultraviolet/50/available-updates.png"
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

    if (!isAuthenticated) {
        return <Loading />
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="w-full pb-3 pt-6 bg-[#F9F9FB] sticky top-0 flex items-center">
                <input
                    type="text"
                    placeholder="Cari berdasarkan nama"
                    className="mx-4 placeholder-gray-400/70 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 w-full"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mx-4 mt-3 mb-20 sm:mb-6">
                {filteredMenus.map(({ id, name, stock, dose, initial_stock, final_stock, out_stock, loading }) => (
                    <div key={id} className="p-6 flex flex-col border rounded-3xl bg-white shadow-sm">
                        <span className="font-semibold text-xl mb-3">{name}</span>
                        <div className="flex flex-col text-center items-center">
                            <span className="capitalize font-semibold">jumlah Stock</span>
                            <div className="flex gap-1">
                                <span className="font-semibold text-xl text-gray-700">{formatNumber(stock)}</span>
                                <span className="text-md text-gray-700 font-semibold">|</span>
                                <span className="text-lg font-semibold capitalize text-gray-700">{dose}</span>
                            </div>
                            {editingId === id ? (
                                <div className="relative mt-3 w-full">
                                    <input
                                        type="text"
                                        className="block w-full px-6 py-3 text-md border rounded-xl focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                                        placeholder="Ubah harga barang"
                                        ref={(el) => (inputRefs.current[id] = el)}
                                        onInput={(e) => {
                                            let value = e.target.value.replace(/\D/g, "");
                                            e.target.value = formatNumber(value);
                                        }}
                                    />
                                    <button
                                        onClick={() => handlePriceChange(id, name)}
                                        disabled={loading}
                                        className={`absolute end-1.5 bottom-1.5 rounded-full bg-green-100 p-2.5 text-xs border border-green-600 font-medium transition focus:ring-3 focus:outline-hidden ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {loading ? "Memperbarui..." : "Ubah bahan"}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {user?.role === "admin" &&
                                        <div className="flex items-center justify-center mt-3 rounded-full bg-green-100 p-2.5 text-sm border border-green-600 font-medium transition duration-300 hover:scale-105  focus:ring-3 focus:outline-hidden w-full">
                                            <button onClick={() => setEditingId(id)}>
                                                <span className="text-gray-900 fony-semibold capitalize">ubah jumlah bahan</span>
                                            </button>
                                        </div>
                                    }
                                </>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 mt-6">
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
    );
}
