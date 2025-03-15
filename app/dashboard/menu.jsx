"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";

export default function Menu() {
    const [menuData, setMenuData] = useState({
        kebab: { items: [], harga: 0, count: 1, nama: "", icon: "https://img.icons8.com/bubbles/100/burrito.png" },
        burger: { items: [], harga: 0, count: 1, nama: "", icon: "https://img.icons8.com/bubbles/100/hamburger.png" },
        minuman: { items: [], harga: 0, count: 1, nama: "", icon: "https://img.icons8.com/bubbles/100/iced-coffee.png" },
    });

    const [loadingCategory, setLoadingCategory] = useState({
        kebab: false,
        burger: false,
        minuman: false
    });


    useEffect(() => {
        Promise.all([
            axios.get("/api/menuDas/kebab"),
            axios.get("/api/menuDas/burger"),
            axios.get("/api/menuDas/minuman"),
        ])
            .then(([kebabRes, burgerRes, minumanRes]) => {
                setMenuData((prev) => ({
                    ...prev,
                    kebab: { ...prev.kebab, items: kebabRes.data },
                    burger: { ...prev.burger, items: burgerRes.data },
                    minuman: { ...prev.minuman, items: minumanRes.data },
                }));
            })
            .catch(() => {
                Swal.fire({
                    title: "Error",
                    text: "Gagal memuat menu, periksa koneksi Anda!",
                    icon: "error",
                });
            });
    }, []);

    const updateStock = async (nama, count) => {
        try {
            await axios.post("/api/updateStock", { menu_name: nama, count });
        } catch (error) {
            console.error("Error updating stock:", error);
        }
    };

    const kirimKeIncome = async (category) => {
        const { harga, count, nama } = menuData[category];
        const totalHarga = harga * count;
        if (!nama || count < 1) {
            Swal.fire({ title: "Peringatan", text: "Silakan pilih menu dan jumlah harus lebih dari 0!", icon: "warning" });
            return;
        }

        const confirmResult = await Swal.fire({
            title: "Konfirmasi",
            text: `Apakah Anda yakin ingin menambahkan ${category} ${nama} sebanyak ${count} dengan total harga Rp${new Intl.NumberFormat("id-ID").format(totalHarga)}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Simpan",
            cancelButtonText: "Batal",
            confirmButtonColor: "#3B82F6",
            cancelButtonColor: "#B12D67",
        });

        if (!confirmResult.isConfirmed) return;
        setLoadingCategory(prev => ({ ...prev, [category]: true }));

        try {
            await axios.post("/api/income", {
                totalHarga,
                item: count,
                category,
                nama
            });
            await axios.post("/api/history", {
                totalHarga,
                item: count,
                keterangan: 'Terjual', 
                // jangan ubah kalimat Terjual karna berddampak pada pdf
                category,
                nama,
                icon: menuData[category].icon
            });
            await updateStock(nama, count);

            Swal.fire({ title: "Success", text: `Data ${category} berhasil disimpan!`, icon: "success" });

            setMenuData((prev) => ({
                ...prev,
                [category]: { ...prev[category], harga: 0, count: 1, nama: "" },
            }));
        } catch (error) {
            Swal.fire({ title: "Error", text: `Gagal mengirim data ${category}!`, icon: "error" });
        } finally {
            setLoadingCategory(prev => ({ ...prev, [category]: false }));
        }
    };

    return (
        <div className="mt-12 mb-24 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-md text-[#B12D67]">Menu Terjual</span>
                <Link href="/trafik" className="group relative inline-flex items-center overflow-hidden bg-blue-100 rounded-full border border-blue-600 px-5 py-2 text-blue-600 focus:ring focus:outline-none focus:ring-blue-300">
                    <span className="absolute -end-full transition-all group-hover:end-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </span>
                    <span className="text-sm transition-all group-hover:me-4">Lihat Semua</span>
                </Link>
            </div>

            <div className="grid xl:grid-cols-2 gap-6">
                {Object.entries(menuData).map(([category, data], index) => (
                    <div key={index} className="flex flex-col align-center gap-6 p-6 rounded-3xl bg-white">
                        <div className="flex items-center flex-col">
                            <div className="w-full flex items-center justify-between">
                                <img src={data.icon} alt={`icon ${category}`} className="w-16" />
                                <span className="text-sm font-semibold capitalize text-[#B13069]">{data.nama}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xl font-semibold text-green-500">Rp{new Intl.NumberFormat("id-ID").format(data.harga * data.count)}</span>
                                <span className="text-gray-600">+ {data.count}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap">
                            {data.items.map((item, idx) => (
                                <button key={idx} onClick={() => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], harga: item.price, nama: item.name } }))}
                                    className="px-5 py-2 tracking-wide text-gray-800 capitalize text-sm bg-white rounded-full m-1 border border-gray-300 hover:bg-gray-200">
                                    {item.name}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex gap-1 items-center">
                                <button onClick={() => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], count: Math.max(0, data.count - 1) } }))}
                                    className="p-2.5 border rounded-xl hover:bg-red-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                    </svg>
                                </button>

                                <input type="tel" inputMode="numeric" pattern="[0-9]*" value={data.count}
                                    onChange={(e) => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], count: Math.max(0, parseInt(e.target.value.replace(/\D/g, '')) || 0) } }))}
                                    className="border w-20 h-10 text-center rounded-xl bg-gray-100"
                                />

                                <button onClick={() => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], count: data.count + 1 } }))}
                                    className="p-2.5 border rounded-xl hover:bg-green-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>

                            <button onClick={() => kirimKeIncome(category)} disabled={loadingCategory[category]} className={`px-5 py-2 border rounded-full font-semibold ${loadingCategory[category] ? "bg-gray-400 cursor-not-allowed" : "bg-green-300 hover:bg-green-400 text-gray-600 hover:text-white border-green-600"}`}>
                                {loadingCategory[category] ? "Mengirim..." : "Tambah"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
