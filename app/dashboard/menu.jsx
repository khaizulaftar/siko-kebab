// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Link from "next/link";
// import Swal from "sweetalert2";

// export default function Menu() {
//     const [menuData, setMenuData] = useState({
//         kebab: { items: [], harga: 0, count: 1, nama: "", icon: "https://img.icons8.com/bubbles/100/burrito.png" },
//         burger: { items: [], harga: 0, count: 1, nama: "", icon: "https://img.icons8.com/bubbles/100/hamburger.png" },
//         minuman: { items: [], harga: 0, count: 1, nama: "", icon: "https://img.icons8.com/bubbles/100/iced-coffee.png" },
//     });

//     const [loadingCategory, setLoadingCategory] = useState({
//         kebab: false,
//         burger: false,
//         minuman: false
//     });


//     useEffect(() => {
//         Promise.all([
//             axios.get("/api/menuDas/kebab"),
//             axios.get("/api/menuDas/burger"),
//             axios.get("/api/menuDas/minuman"),
//         ])
//             .then(([kebabRes, burgerRes, minumanRes]) => {
//                 setMenuData((prev) => ({
//                     ...prev,
//                     kebab: { ...prev.kebab, items: kebabRes.data },
//                     burger: { ...prev.burger, items: burgerRes.data },
//                     minuman: { ...prev.minuman, items: minumanRes.data },
//                 }));
//             })
//             .catch(() => {
//                 Swal.fire({
//                     title: "Error",
//                     text: "Gagal memuat menu, periksa koneksi Anda!",
//                     icon: "error",
//                 });
//             });
//     }, []);

//     const updateStock = async (nama, count) => {
//         try {
//             await axios.post("/api/updateStock", { menu_name: nama, count });
//         } catch (error) {
//             console.error("Error updating stock:", error);
//         }
//     };

//     const kirimKeIncome = async (category) => {
//         const { harga, count, nama } = menuData[category];
//         const totalHarga = harga * count;
//         if (!nama || count < 1) {
//             Swal.fire({ title: "Peringatan", text: "Silakan pilih menu dan jumlah harus lebih dari 0!", icon: "warning" });
//             return;
//         }

//         const confirmResult = await Swal.fire({
//             title: "Konfirmasi",
//             text: `Apakah Anda yakin ingin menambahkan ${category} ${nama} sebanyak ${count} dengan total harga Rp${new Intl.NumberFormat("id-ID").format(totalHarga)}?`,
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonText: "Ya, Simpan",
//             cancelButtonText: "Batal",
//             confirmButtonColor: "#3B82F6",
//             cancelButtonColor: "#B12D67",
//         });

//         if (!confirmResult.isConfirmed) return;
//         setLoadingCategory(prev => ({ ...prev, [category]: true }));

//         try {
//             await axios.post("/api/income", {
//                 totalHarga,
//                 item: count,
//                 category,
//                 nama
//             });
//             await axios.post("/api/history", {
//                 totalHarga,
//                 item: count,
//                 keterangan: 'Terjual', 
//                 // jangan ubah kalimat Terjual karna berddampak pada pdf
//                 category,
//                 nama,
//                 icon: menuData[category].icon
//             });
//             await updateStock(nama, count);

//             Swal.fire({ title: "Success", text: `Data ${category} berhasil disimpan!`, icon: "success" });

//             setMenuData((prev) => ({
//                 ...prev,
//                 [category]: { ...prev[category], harga: 0, count: 1, nama: "" },
//             }));
//         } catch (error) {
//             Swal.fire({ title: "Error", text: `Gagal mengirim data ${category}!`, icon: "error" });
//         } finally {
//             setLoadingCategory(prev => ({ ...prev, [category]: false }));
//         }
//     };

//     return (
//         <div className="mt-12 mb-24 sm:mb-6">
//             <div className="flex items-center justify-between mb-4">
//                 <span className="font-semibold text-md text-[#B12D67]">Menu Terjual</span>
//                 <Link href="/trafik" className="group relative inline-flex items-center overflow-hidden bg-blue-100 rounded-full border border-blue-600 px-5 py-2 text-blue-600 focus:ring focus:outline-none focus:ring-blue-300">
//                     <span className="absolute -end-full transition-all group-hover:end-4">
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
//                         </svg>
//                     </span>
//                     <span className="text-sm transition-all group-hover:me-4">Lihat Semua</span>
//                 </Link>
//             </div>

//             <div className="grid xl:grid-cols-2 gap-6">
//                 {Object.entries(menuData).map(([category, data], index) => (
//                     <div key={index} className="flex flex-col align-center gap-6 p-6 rounded-3xl bg-white">
//                         <div className="flex items-center flex-col">
//                             <div className="w-full flex items-center justify-between">
//                                 <img src={data.icon} alt={`icon ${category}`} className="w-16" />
//                                 <span className="text-sm font-semibold capitalize text-[#B13069]">{data.nama}</span>
//                             </div>
//                             <div className="flex items-center gap-1">
//                                 <span className="text-xl font-semibold text-green-500">Rp{new Intl.NumberFormat("id-ID").format(data.harga * data.count)}</span>
//                                 <span className="text-gray-600">+ {data.count}</span>
//                             </div>
//                         </div>

//                         <div className="flex flex-wrap">
//                             {data.items.map((item, idx) => (
//                                 <button key={idx} onClick={() => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], harga: item.price, nama: item.name } }))}
//                                     className="px-5 py-2 tracking-wide text-gray-800 capitalize text-sm bg-white rounded-full m-1 border border-gray-300 hover:bg-gray-200">
//                                     {item.name}
//                                 </button>
//                             ))}
//                         </div>

//                         <div className="flex justify-between items-center">
//                             <div className="flex gap-1 items-center">
//                                 <button onClick={() => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], count: Math.max(0, data.count - 1) } }))}
//                                     className="p-2.5 border rounded-xl hover:bg-red-100">
//                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
//                                     </svg>
//                                 </button>

//                                 <input type="tel" inputMode="numeric" pattern="[0-9]*" value={data.count}
//                                     onChange={(e) => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], count: Math.max(0, parseInt(e.target.value.replace(/\D/g, '')) || 0) } }))}
//                                     className="border w-20 h-10 text-center rounded-xl bg-gray-100"
//                                 />

//                                 <button onClick={() => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], count: data.count + 1 } }))}
//                                     className="p-2.5 border rounded-xl hover:bg-green-100">
//                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4">
//                                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//                                     </svg>
//                                 </button>
//                             </div>

//                             <button onClick={() => kirimKeIncome(category)} disabled={loadingCategory[category]} className={`px-5 py-2 border rounded-full font-semibold ${loadingCategory[category] ? "bg-gray-400 cursor-not-allowed" : "bg-green-300 hover:bg-green-400 text-gray-600 hover:text-white border-green-600"}`}>
//                                 {loadingCategory[category] ? "Mengirim..." : "Tambah"}
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";

// Data paket yang fleksibel (bisa ditambah/dihapus dengan mudah)
const packages = {
    kebab: [
        { packageName: "Paket Kebab 1", variant: "Original", price: 25000 },
        { packageName: "Paket Kebab 2", variant: "Jumbo", price: 30000 },
        { packageName: "Paket Kebab 3", variant: "Telur", price: 28000 },
    ],
    kentang: [
        { packageName: "Kentang Goreng", variant: "Regular", price: 15000 },
        { packageName: "Kentang Keju", variant: "Spesial", price: 18000 },
    ],
    burger: [
        { packageName: "Paket Burger 1", variant: "Ayam Original", price: 30000 },
        { packageName: "Paket Burger 2", variant: "Ayam Spesial", price: 35000 },
    ],
    burgerManis: [
        { packageName: "Burger Manis 1", variant: "Coklat", price: 20000 },
        { packageName: "Burger Manis 2", variant: "Keju", price: 22000 },
    ],
    minuman: [
        { packageName: "Minuman", variant: "Cola", price: 10000 },
        { packageName: "Minuman", variant: "Fanta", price: 10000 },
    ],
};

// Ikon untuk setiap kategori
const categoryIcons = {
    kebab: "https://img.icons8.com/bubbles/100/burrito.png",
    burger: "https://img.icons8.com/bubbles/100/hamburger.png",
    minuman: "https://img.icons8.com/bubbles/100/iced-coffee.png",
    paket: "https://img.icons8.com/bubbles/50/take-away-food.png",
};

export default function Menu() {
    const [menuData, setMenuData] = useState({
        kebab: { items: [], harga: 0, count: 1, nama: "", icon: categoryIcons.kebab },
        burger: { items: [], harga: 0, count: 1, nama: "", icon: categoryIcons.burger },
        minuman: { items: [], harga: 0, count: 1, nama: "", icon: categoryIcons.minuman },
        paket: { items: [], harga: 0, count: 1, nama: "Paket", selectedItems: [], icon: categoryIcons.paket },
    });

    const [loadingCategory, setLoadingCategory] = useState({
        kebab: false,
        burger: false,
        minuman: false,
        paket: false,
    });

    const [selectedItems, setSelectedItems] = useState({
        kebab: null,
        kentang: null,
        burger: null,
        burgerManis: null,
        minuman: null,
    });

    // Fetch data dari API (jika diperlukan)
    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const [kebabRes, burgerRes, minumanRes] = await Promise.all([
                    axios.get("/api/menuDas/kebab").catch(() => ({ data: packages.kebab })),
                    axios.get("/api/menuDas/burger").catch(() => ({ data: packages.burger })),
                    axios.get("/api/menuDas/minuman").catch(() => ({ data: packages.minuman })),
                ]);

                setMenuData((prev) => ({
                    ...prev,
                    kebab: { ...prev.kebab, items: kebabRes.data },
                    burger: { ...prev.burger, items: burgerRes.data },
                    minuman: { ...prev.minuman, items: minumanRes.data },
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
                Swal.fire({ title: "Error", text: "Gagal memuat menu, periksa koneksi Anda!", icon: "error" });
            }
        };

        fetchMenuData();
    }, []);

    // Update stok
    const updateStock = async (nama, count) => {
        try {
            await axios.post("/api/updateStock", { menu_name: nama, count });
        } catch (error) {
            console.error("Error updating stock:", error);
        }
    };

    // Hitung total harga
    const calculateTotalPrice = () => {
        return Object.values(selectedItems).reduce((total, item) => total + (item?.price || 0), 0);
    };

    // Update total harga saat selectedItems berubah
    useEffect(() => {
        const totalHarga = calculateTotalPrice();
        setMenuData((prev) => ({ ...prev, paket: { ...prev.paket, harga: totalHarga } }));
    }, [selectedItems]);

    // Kirim data ke income
    const kirimKeIncome = async (category) => {
        const { harga, count, nama } = menuData[category];

        if (category === "paket") {
            const totalHarga = calculateTotalPrice();
            const selectedItemsList = Object.entries(selectedItems)
                .map(([key, item]) => {
                    if (item) {
                        // Ubah kategori kentang menjadi kebab dan burgerManis menjadi burger
                        const updatedCategory = key === "kentang" ? "kebab" : key === "burgerManis" ? "burger" : key;
                        return { ...item, category: updatedCategory };
                    }
                    return null;
                })
                .filter((item) => item !== null);

            if (count < 1) {
                Swal.fire({ title: "Peringatan", text: "Jumlah harus lebih dari 0!", icon: "warning" });
                return;
            }

            const confirmResult = await Swal.fire({
                title: "Konfirmasi",
                text: `Apakah Anda yakin ingin menambahkan paket sebanyak ${count} dengan total harga Rp${new Intl.NumberFormat("id-ID").format(totalHarga * count)}?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Ya, Simpan",
                cancelButtonText: "Batal",
                confirmButtonColor: "#3B82F6",
                cancelButtonColor: "#B12D67",
            });

            if (!confirmResult.isConfirmed) return;
            setLoadingCategory((prev) => ({ ...prev, [category]: true }));

            try {
                for (const item of selectedItemsList) {
                    await axios.post("/api/income", {
                        totalHarga: item.price * count,
                        item: count,
                        category: item.category,
                        nama: item.variant,
                    });
                }

                await axios.post("/api/history", {
                    totalHarga: totalHarga * count,
                    item: count,
                    keterangan: "Terjual",
                    category: "paket",
                    nama: selectedItems.kebab ? selectedItems.kebab.packageName : selectedItems.burger.packageName,
                    icon: menuData[category].icon,
                });

                for (const item of selectedItemsList) {
                    await updateStock(item.packageName, count);
                }

                Swal.fire({ title: "Success", text: `Data ${category} berhasil disimpan!`, icon: "success" });

                setMenuData((prev) => ({
                    ...prev,
                    [category]: { ...prev[category], harga: 0, count: 1, selectedItems: [] },
                }));
                setSelectedItems({
                    kebab: null,
                    kentang: null,
                    burger: null,
                    burgerManis: null,
                    minuman: null,
                });
            } catch (error) {
                Swal.fire({ title: "Error", text: `Gagal mengirim data ${category}!`, icon: "error" });
            } finally {
                setLoadingCategory((prev) => ({ ...prev, [category]: false }));
            }
        } else {
            if (!nama || count < 1) {
                Swal.fire({ title: "Peringatan", text: "Silakan pilih menu dan jumlah harus lebih dari 0!", icon: "warning" });
                return;
            }

            const confirmResult = await Swal.fire({
                title: "Konfirmasi",
                text: `Apakah Anda yakin ingin menambahkan ${category} ${nama} sebanyak ${count} dengan total harga Rp${new Intl.NumberFormat("id-ID").format(harga * count)}?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Ya, Simpan",
                cancelButtonText: "Batal",
                confirmButtonColor: "#3B82F6",
                cancelButtonColor: "#B12D67",
            });

            if (!confirmResult.isConfirmed) return;
            setLoadingCategory((prev) => ({ ...prev, [category]: true }));

            try {
                await axios.post("/api/income", {
                    totalHarga: harga * count,
                    item: count,
                    category,
                    nama,
                });
                await axios.post("/api/history", {
                    totalHarga: harga * count,
                    item: count,
                    keterangan: "Terjual",
                    category,
                    nama,
                    icon: menuData[category].icon,
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
                setLoadingCategory((prev) => ({ ...prev, [category]: false }));
            }
        }
    };

    // Render komponen
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

            <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(menuData).map(([category, data], index) => (
                    <div key={index} className="flex flex-col align-center gap-6 p-6 rounded-3xl bg-white">
                        <div className="flex items-center flex-col">
                            <div className="w-full flex items-center justify-between">
                                <img src={data.icon} alt={`icon ${category}`} className="w-16" />
                                <span className="text-sm font-semibold capitalize text-[#B13069]">{data.nama}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                                <span className="text-xl font-semibold text-green-500">Rp{new Intl.NumberFormat("id-ID").format(data.harga * data.count)}</span>
                                <span className="text-gray-600">+ {data.count}</span>
                            </div>
                        </div>

                        {category === "paket" ? (
                            <div className="flex flex-col gap-4">
                                {Object.entries(packages).map(([key, options]) => (
                                    <div key={key}>
                                        <h3 className="font-semibold mb-2">Pilih {key}</h3>

                                        <select
                                            value={selectedItems[key] ? `${selectedItems[key].packageName} - ${selectedItems[key].variant}` : ""}
                                            onChange={(e) => {
                                                const selectedPackage = e.target.value;
                                                const selectedItem = options.find((item) => `${item.packageName} - ${item.variant}` === selectedPackage);
                                                setSelectedItems((prev) => {
                                                    const newSelectedItems = { ...prev, [key]: selectedItem || null };
                                                    if (key === "kebab" && selectedItem) {
                                                        newSelectedItems.burger = null;
                                                    } else if (key === "burger" && selectedItem) {
                                                        newSelectedItems.kebab = null;
                                                    }
                                                    return newSelectedItems;
                                                });
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            disabled={(key === "burger" && selectedItems.kebab) || (key === "kebab" && selectedItems.burger)}
                                        >
                                            <option value="">Pilih {key} (Opsional)</option>
                                            {options.map((item, idx) => (
                                                <option key={idx} value={`${item.packageName} - ${item.variant}`}>
                                                    {item.packageName} - {item.variant} (Rp{new Intl.NumberFormat("id-ID").format(item.price)})
                                                </option>
                                            ))}
                                        </select>

                                        {selectedItems[key] && (
                                            <span className="text-sm text-green-500 mt-1">Harga: Rp{new Intl.NumberFormat("id-ID").format(selectedItems[key].price)}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {data.items.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], harga: item.price, nama: item.name } }))}
                                        className="px-5 py-2 tracking-wide text-gray-800 capitalize text-sm bg-white rounded-full border border-gray-300 hover:bg-gray-200 transition-all"
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <div className="flex gap-1 items-center">
                                <button
                                    onClick={() => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], count: Math.max(0, data.count - 1) } }))}
                                    className="p-2.5 border rounded-xl hover:bg-red-100 transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                    </svg>
                                </button>

                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={data.count}
                                    onChange={(e) => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], count: Math.max(0, parseInt(e.target.value.replace(/\D/g, "")) || 0) } }))}
                                    className="border w-20 h-10 text-center rounded-xl bg-gray-100 focus:outline-none focus:border-blue-500"
                                />

                                <button
                                    onClick={() => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], count: data.count + 1 } }))}
                                    className="p-2.5 border rounded-xl hover:bg-green-100 transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>

                            <button
                                onClick={() => kirimKeIncome(category)}
                                disabled={loadingCategory[category]}
                                className={`px-5 py-2 border rounded-full font-semibold transition-all ${loadingCategory[category]
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-300 hover:bg-green-400 text-gray-600 hover:text-white border-green-600"
                                    }`}
                            >
                                {loadingCategory[category] ? "Mengirim..." : "Tambah"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}