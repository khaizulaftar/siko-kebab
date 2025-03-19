// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Link from "next/link";
// import Swal from "sweetalert2";

// // Data paket yang fleksibel (bisa ditambah/dihapus dengan mudah)
// const packages = {
//     kebab: [
//         { packageName: "Paket Kebab 1", variant: "Original", price: 13000 },
//         { packageName: "Paket Kebab 2", variant: "Jumbo", price: 25000 },
//         { packageName: "Paket Kebab 3", variant: "Telur", price: 10000 },
//         { packageName: "Paket Kebab 4", variant: "Ayam", price: 15000 },
//         { packageName: "Paket Kebab 5", variant: "Sosis", price: 12000 },
//     ],
//     burger: [
//         { packageName: "Paket Burger 1", variant: "Ayam Original", price: 12000 },
//         { packageName: "Paket Burger 2", variant: "Ayam Spesial", price: 18000 },
//         { packageName: "Paket Burger 3", variant: "Sapi Original", price: 10000 },
//         { packageName: "Paket Burger 4", variant: "Sapi Spesial", price: 14000 },
//     ],
//     kentang: [
//         { packageName: "Paket Kentang 1", variant: "Kentang Goreng", price: 10000 },
//     ],
//     burgerManis: [
//         { packageName: "Paket BurgerManis 1", variant: "Coklat", price: 10000 },
//         { packageName: "Paket BurgerManis 2", variant: "Coklat Keju", price: 10000 },
//         { packageName: "Paket BurgerManis 3", variant: "Tiramisu", price: 10000 },
//         { packageName: "Paket BurgerManis 4", variant: "Lotus", price: 10000 },
//     ],
//     minuman: [
//         { packageName: "Paket Minuman 1", variant: "Cola", price: 6000 },
//         { packageName: "Paket Minuman 2", variant: "Fanta", price: 6000 },
//         { packageName: "Paket Minuman 3", variant: "Sprite", price: 6000 },
//         { packageName: "Paket Minuman 4", variant: "Mineral", price: 6000 },
//     ],
// };

// // Ikon untuk setiap kategori
// const categoryIcons = {
//     kebab: "https://img.icons8.com/bubbles/100/burrito.png",
//     burger: "https://img.icons8.com/bubbles/100/hamburger.png",
//     minuman: "https://img.icons8.com/bubbles/100/iced-coffee.png",
//     paket: "https://img.icons8.com/bubbles/100/take-away-food.png",
// };

// export default function Menu() {
//     const [isMainItemSelected, setIsMainItemSelected] = useState(false);

//     const [menuData, setMenuData] = useState({
//         kebab: { items: [], harga: 0, count: 1, nama: "", icon: categoryIcons.kebab, diskon: 0 },
//         burger: { items: [], harga: 0, count: 1, nama: "", icon: categoryIcons.burger, diskon: 0 },
//         minuman: { items: [], harga: 0, count: 1, nama: "", icon: categoryIcons.minuman, diskon: 0 },
//         paket: { items: [], harga: 0, count: 1, nama: "Menu paket", selectedItems: [], icon: categoryIcons.paket, diskon: 0 },
//     });

//     const [loadingCategory, setLoadingCategory] = useState({
//         kebab: false,
//         burger: false,
//         minuman: false,
//         paket: false,
//     });

//     const categoryMapping = {
//         kentang: "kebab",
//         burgerManis: "burger",
//         minuman: "minuman",
//     };
//     const [selectedItems, setSelectedItems] = useState({
//         kebab: null,
//         burger: null,
//         kentang: null,
//         burgerManis: null,
//         minuman: null,
//     });

//     // Fetch data dari API (jika diperlukan)
//     useEffect(() => {
//         const fetchMenuData = async () => {
//             try {
//                 const [kebabRes, burgerRes, minumanRes] = await Promise.all([
//                     axios.get("/api/menuDas/kebab").catch(() => ({ data: packages.kebab })),
//                     axios.get("/api/menuDas/burger").catch(() => ({ data: packages.burger })),
//                     axios.get("/api/menuDas/minuman").catch(() => ({ data: packages.minuman })),
//                 ]);

//                 setMenuData((prev) => ({
//                     ...prev,
//                     kebab: { ...prev.kebab, items: kebabRes.data },
//                     burger: { ...prev.burger, items: burgerRes.data },
//                     minuman: { ...prev.minuman, items: minumanRes.data },
//                 }));
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//                 Swal.fire({ title: "Error", text: "Gagal memuat menu, periksa koneksi Anda!", icon: "error" });
//             }
//         };
//         const isMainSelected = selectedItems.kebab !== null || selectedItems.burger !== null;
//         setIsMainItemSelected(isMainSelected);

//         fetchMenuData();
//     }, [selectedItems.kebab, selectedItems.burger]);

//     // Update stok
//     const updateStock = async (nama, count) => {
//         try {
//             await axios.post("/api/updateStock", { menu_name: nama, count });
//         } catch (error) {
//             console.error("Error updating stock:", error);
//         }
//     };

//     // Hitung total harga setelah diskon
//     const calculateTotalPrice = () => {
//         return Object.values(selectedItems).reduce((total, item) => total + (item?.price || 0), 0);
//     };

//     // Update total harga saat selectedItems berubah
//     useEffect(() => {
//         const totalHarga = calculateTotalPrice();
//         setMenuData((prev) => ({ ...prev, paket: { ...prev.paket, harga: totalHarga } }));
//     }, [selectedItems]);

//     // const kirimKeIncome = async (category) => {
//     //     const { harga, count, nama, diskon } = menuData[category];

//     //     if (category === "paket") {
//     //         const totalHarga = calculateTotalPrice();
//     //         const totalHargaSetelahDiskon = totalHarga * count - diskon;
//     //         const selectedItemsList = Object.entries(selectedItems)
//     //             .map(([key, item]) => {
//     //                 if (item) {
//     //                     const updatedCategory = categoryMapping[key] || key;
//     //                     return { ...item, category: updatedCategory };
//     //                 }
//     //                 return null;
//     //             })
//     //             .filter((item) => item !== null);

//     //         if (count < 1) {
//     //             Swal.fire({ title: "Peringatan", text: "Jumlah harus lebih dari 0!", icon: "warning" });
//     //             return;
//     //         }

//     //         const confirmResult = await Swal.fire({
//     //             title: "Konfirmasi",
//     //             text: `Apakah Anda yakin ingin menambahkan paket sebanyak ${count} dengan total harga Rp${new Intl.NumberFormat("id-ID").format(totalHargaSetelahDiskon)}?`,
//     //             icon: "question",
//     //             showCancelButton: true,
//     //             confirmButtonText: "Ya, Simpan",
//     //             cancelButtonText: "Batal",
//     //             confirmButtonColor: "#3B82F6",
//     //             cancelButtonColor: "#B12D67",
//     //         });

//     //         if (!confirmResult.isConfirmed) return;
//     //         setLoadingCategory((prev) => ({ ...prev, [category]: true }));

//     //         if (!selectedItemsList.every(item => item && item.variant && item.price)) {
//     //             Swal.fire({ title: "Error", text: "Data tidak valid!", icon: "error" });
//     //             return;
//     //         }

//     //         try {
//     //             for (const item of selectedItemsList) {
//     //                 await axios.post("/api/income", {
//     //                     totalHarga: item.price * count,
//     //                     item: count,
//     //                     category: item.category,
//     //                     nama: item.variant, // Menggunakan variant sebagai nama
//     //                 });
//     //             }

//     //             await axios.post("/api/history", {
//     //                 totalHarga: totalHargaSetelahDiskon,
//     //                 item: count,
//     //                 keterangan: "Terjual",
//     //                 category: "paket",
//     //                 nama: selectedItems.kebab ? selectedItems.kebab.packageName : selectedItems.burger ? selectedItems.burger.packageName : "",
//     //                 icon: menuData[category].icon,
//     //             });

//     //             for (const item of selectedItemsList) {
//     //                 await updateStock(item.variant, count);
//     //             }

//     //             console.log("Selected Items:", selectedItems);
//     //             console.log("Total Harga:", totalHargaSetelahDiskon);

//     //             Swal.fire({ title: "Success", text: `Data ${category} berhasil disimpan!`, icon: "success" });

//     //             setMenuData((prev) => ({
//     //                 ...prev,
//     //                 [category]: { ...prev[category], harga: 0, count: 1, selectedItems: [], diskon: 0 },
//     //             }));
//     //             setSelectedItems({
//     //                 kebab: null,
//     //                 kentang: null,
//     //                 burger: null,
//     //                 burgerManis: null,
//     //                 minuman: null,
//     //             });
//     //         } catch (error) {
//     //             console.error("Error sending data:", error);
//     //             Swal.fire({ title: "Error", text: `Gagal mengirim data ${category}!`, icon: "error" });
//     //         } finally {
//     //             setLoadingCategory((prev) => ({ ...prev, [category]: false }));
//     //         }
//     //     } else {
//     //         if (!nama || count < 1) {
//     //             Swal.fire({ title: "Peringatan", text: "Silakan pilih menu dan jumlah harus lebih dari 0!", icon: "warning" });
//     //             return;
//     //         }

//     //         const totalHargaSetelahDiskon = harga * count - diskon;

//     //         const confirmResult = await Swal.fire({
//     //             title: "Konfirmasi",
//     //             text: `Apakah Anda yakin ingin menambahkan ${category} ${nama} sebanyak ${count} dengan total harga Rp${new Intl.NumberFormat("id-ID").format(totalHargaSetelahDiskon)}?`,
//     //             icon: "question",
//     //             showCancelButton: true,
//     //             confirmButtonText: "Ya, Simpan",
//     //             cancelButtonText: "Batal",
//     //             confirmButtonColor: "#3B82F6",
//     //             cancelButtonColor: "#B12D67",
//     //         });

//     //         if (!confirmResult.isConfirmed) return;
//     //         setLoadingCategory((prev) => ({ ...prev, [category]: true }));

//     //         try {
//     //             await axios.post("/api/income", {
//     //                 totalHarga: totalHargaSetelahDiskon,
//     //                 item: count,
//     //                 category,
//     //                 nama: nama,
//     //             });
//     //             await axios.post("/api/history", {
//     //                 totalHarga: totalHargaSetelahDiskon,
//     //                 item: count,
//     //                 keterangan: "Terjual",
//     //                 category,
//     //                 nama: nama,
//     //                 icon: menuData[category].icon,
//     //             });
//     //             await updateStock(nama, count);

//     //             Swal.fire({ title: "Success", text: `Data ${category} berhasil disimpan!`, icon: "success" });

//     //             setMenuData((prev) => ({
//     //                 ...prev,
//     //                 [category]: { ...prev[category], harga: 0, count: 1, nama: "", diskon: 0 },
//     //             }));
//     //         } catch (error) {
//     //             console.error("Error sending data:", error);
//     //             Swal.fire({ title: "Error", text: `Gagal mengirim data ${category}!`, icon: "error" });
//     //         } finally {
//     //             setLoadingCategory((prev) => ({ ...prev, [category]: false }));
//     //         }
//     //     }
//     // };

//     // const kirimKeIncome = async (category) => {
//     //     const { harga, count, nama, diskon } = menuData[category];

//     //     if (category === "paket") {
//     //         const totalHarga = calculateTotalPrice();
//     //         const selectedItemsList = Object.entries(selectedItems)
//     //             .map(([key, item]) => {
//     //                 if (item) {
//     //                     const updatedCategory = categoryMapping[key] || key;
//     //                     return { ...item, category: updatedCategory };
//     //                 }
//     //                 return null;
//     //             })
//     //             .filter((item) => item !== null);

//     //         if (count < 1) {
//     //             Swal.fire({ title: "Peringatan", text: "Jumlah harus lebih dari 0!", icon: "warning" });
//     //             return;
//     //         }

//     //         // Hitung diskon per item
//     //         const diskonPerItem = Math.round(diskon / selectedItemsList.length);

//     //         const confirmResult = await Swal.fire({
//     //             title: "Konfirmasi",
//     //             text: `Apakah Anda yakin ingin menambahkan paket sebanyak ${count} dengan total harga Rp${new Intl.NumberFormat("id-ID").format(totalHarga * count - diskon)}?`,
//     //             icon: "question",
//     //             showCancelButton: true,
//     //             confirmButtonText: "Ya, Simpan",
//     //             cancelButtonText: "Batal",
//     //             confirmButtonColor: "#3B82F6",
//     //             cancelButtonColor: "#B12D67",
//     //         });

//     //         if (!confirmResult.isConfirmed) return;
//     //         setLoadingCategory((prev) => ({ ...prev, [category]: true }));

//     //         if (!selectedItemsList.every(item => item && item.variant && item.price)) {
//     //             Swal.fire({ title: "Error", text: "Data tidak valid!", icon: "error" });
//     //             return;
//     //         }

//     //         try {
//     //             for (const item of selectedItemsList) {
//     //                 // Hitung harga per item setelah diskon
//     //                 const hargaPerItemSetelahDiskon = item.price * count - diskonPerItem;

//     //                 await axios.post("/api/income", {
//     //                     totalHarga: hargaPerItemSetelahDiskon, // Harga per item setelah diskon
//     //                     item: count,
//     //                     category: item.category,
//     //                     nama: item.variant, // Menggunakan variant sebagai nama
//     //                 });
//     //             }

//     //             await axios.post("/api/history", {
//     //                 totalHarga: totalHarga * count - diskon, // Total harga setelah diskon
//     //                 item: count,
//     //                 keterangan: "Terjual",
//     //                 category: "paket",
//     //                 nama: selectedItems.kebab ? selectedItems.kebab.packageName : selectedItems.burger ? selectedItems.burger.packageName : "",
//     //                 icon: menuData[category].icon,
//     //             });

//     //             for (const item of selectedItemsList) {
//     //                 await updateStock(item.variant, count);
//     //             }

//     //             console.log("Selected Items:", selectedItems);
//     //             console.log("Total Harga:", totalHarga * count - diskon);

//     //             Swal.fire({ title: "Success", text: `Data ${category} berhasil disimpan!`, icon: "success" });

//     //             setMenuData((prev) => ({
//     //                 ...prev,
//     //                 [category]: { ...prev[category], harga: 0, count: 1, selectedItems: [], diskon: 0 },
//     //             }));
//     //             setSelectedItems({
//     //                 kebab: null,
//     //                 kentang: null,
//     //                 burger: null,
//     //                 burgerManis: null,
//     //                 minuman: null,
//     //             });
//     //         } catch (error) {
//     //             console.error("Error sending data:", error);
//     //             Swal.fire({ title: "Error", text: `Gagal mengirim data ${category}!`, icon: "error" });
//     //         } finally {
//     //             setLoadingCategory((prev) => ({ ...prev, [category]: false }));
//     //         }
//     //     } else {
//     //         // Kode untuk kategori selain paket (tidak berubah)
//     //         if (!nama || count < 1) {
//     //             Swal.fire({ title: "Peringatan", text: "Silakan pilih menu dan jumlah harus lebih dari 0!", icon: "warning" });
//     //             return;
//     //         }

//     //         const totalHargaSetelahDiskon = harga * count - diskon;

//     //         const confirmResult = await Swal.fire({
//     //             title: "Konfirmasi",
//     //             text: `Apakah Anda yakin ingin menambahkan ${category} ${nama} sebanyak ${count} dengan total harga Rp${new Intl.NumberFormat("id-ID").format(totalHargaSetelahDiskon)}?`,
//     //             icon: "question",
//     //             showCancelButton: true,
//     //             confirmButtonText: "Ya, Simpan",
//     //             cancelButtonText: "Batal",
//     //             confirmButtonColor: "#3B82F6",
//     //             cancelButtonColor: "#B12D67",
//     //         });

//     //         if (!confirmResult.isConfirmed) return;
//     //         setLoadingCategory((prev) => ({ ...prev, [category]: true }));

//     //         try {
//     //             await axios.post("/api/income", {
//     //                 totalHarga: totalHargaSetelahDiskon,
//     //                 item: count,
//     //                 category,
//     //                 nama: nama,
//     //             });
//     //             await axios.post("/api/history", {
//     //                 totalHarga: totalHargaSetelahDiskon,
//     //                 item: count,
//     //                 keterangan: "Terjual",
//     //                 category,
//     //                 nama: nama,
//     //                 icon: menuData[category].icon,
//     //             });
//     //             await updateStock(nama, count);

//     //             Swal.fire({ title: "Success", text: `Data ${category} berhasil disimpan!`, icon: "success" });

//     //             setMenuData((prev) => ({
//     //                 ...prev,
//     //                 [category]: { ...prev[category], harga: 0, count: 1, nama: "", diskon: 0 },
//     //             }));
//     //         } catch (error) {
//     //             console.error("Error sending data:", error);
//     //             Swal.fire({ title: "Error", text: `Gagal mengirim data ${category}!`, icon: "error" });
//     //         } finally {
//     //             setLoadingCategory((prev) => ({ ...prev, [category]: false }));
//     //         }
//     //     }
//     // };

//     const kirimKeIncome = async (category) => {
//         const { harga, count, nama, diskon } = menuData[category];

//         if (category === "paket") {
//             const totalHarga = calculateTotalPrice();
//             const selectedItemsList = Object.entries(selectedItems)
//                 .map(([key, item]) => {
//                     if (item) {
//                         const updatedCategory = categoryMapping[key] || key;
//                         return { ...item, category: updatedCategory };
//                     }
//                     return null;
//                 })
//                 .filter((item) => item !== null);

//             if (count < 1) {
//                 Swal.fire({ title: "Peringatan", text: "Jumlah harus lebih dari 0!", icon: "warning" });
//                 return;
//             }

//             // Hitung diskon per item dengan pembulatan
//             const diskonPerItem = Math.floor(diskon / selectedItemsList.length); // Gunakan Math.floor untuk menghindari kelebihan diskon
//             const sisaDiskon = diskon % selectedItemsList.length; // Sisa diskon yang belum terbagi

//             const confirmResult = await Swal.fire({
//                 title: "Konfirmasi",
//                 text: `Apakah Anda yakin ingin menambahkan paket sebanyak ${count} dengan total harga Rp${new Intl.NumberFormat("id-ID").format(totalHarga * count - diskon)}?`,
//                 icon: "question",
//                 showCancelButton: true,
//                 confirmButtonText: "Ya, Simpan",
//                 cancelButtonText: "Batal",
//                 confirmButtonColor: "#3B82F6",
//                 cancelButtonColor: "#B12D67",
//             });

//             if (!confirmResult.isConfirmed) return;
//             setLoadingCategory((prev) => ({ ...prev, [category]: true }));

//             if (!selectedItemsList.every(item => item && item.variant && item.price)) {
//                 Swal.fire({ title: "Error", text: "Data tidak valid!", icon: "error" });
//                 return;
//             }

//             try {
//                 for (let i = 0; i < selectedItemsList.length; i++) {
//                     const item = selectedItemsList[i];
//                     // Hitung diskon untuk item ini
//                     const diskonItem = diskonPerItem + (i < sisaDiskon ? 1 : 0); // Tambahkan sisa diskon ke item awal
//                     const hargaPerItemSetelahDiskon = (item.price * count) - diskonItem;

//                     await axios.post("/api/income", {
//                         totalHarga: hargaPerItemSetelahDiskon, // Harga per item setelah diskon
//                         item: count,
//                         category: item.category,
//                         nama: item.variant, // Menggunakan variant sebagai nama
//                     });
//                 }

//                 await axios.post("/api/history", {
//                     totalHarga: totalHarga * count - diskon, // Total harga setelah diskon
//                     item: count,
//                     keterangan: "Terjual",
//                     category: "paket",
//                     nama: selectedItems.kebab ? selectedItems.kebab.packageName : selectedItems.burger ? selectedItems.burger.packageName : "",
//                     icon: menuData[category].icon,
//                 });

//                 for (const item of selectedItemsList) {
//                     await updateStock(item.variant, count);
//                 }

//                 console.log("Selected Items:", selectedItems);
//                 console.log("Total Harga:", totalHarga * count - diskon);

//                 Swal.fire({ title: "Success", text: `Data ${category} berhasil disimpan!`, icon: "success" });

//                 setMenuData((prev) => ({
//                     ...prev,
//                     [category]: { ...prev[category], harga: 0, count: 1, selectedItems: [], diskon: 0 },
//                 }));
//                 setSelectedItems({
//                     kebab: null,
//                     kentang: null,
//                     burger: null,
//                     burgerManis: null,
//                     minuman: null,
//                 });
//             } catch (error) {
//                 console.error("Error sending data:", error);
//                 Swal.fire({ title: "Error", text: `Gagal mengirim data ${category}!`, icon: "error" });
//             } finally {
//                 setLoadingCategory((prev) => ({ ...prev, [category]: false }));
//             }
//         } else {
//             // Kode untuk kategori selain paket (tidak berubah)
//             if (!nama || count < 1) {
//                 Swal.fire({ title: "Peringatan", text: "Silakan pilih menu dan jumlah harus lebih dari 0!", icon: "warning" });
//                 return;
//             }

//             const totalHargaSetelahDiskon = harga * count - diskon;

//             const confirmResult = await Swal.fire({
//                 title: "Konfirmasi",
//                 text: `Apakah Anda yakin ingin menambahkan ${category} ${nama} sebanyak ${count} dengan total harga Rp${new Intl.NumberFormat("id-ID").format(totalHargaSetelahDiskon)}?`,
//                 icon: "question",
//                 showCancelButton: true,
//                 confirmButtonText: "Ya, Simpan",
//                 cancelButtonText: "Batal",
//                 confirmButtonColor: "#3B82F6",
//                 cancelButtonColor: "#B12D67",
//             });

//             if (!confirmResult.isConfirmed) return;
//             setLoadingCategory((prev) => ({ ...prev, [category]: true }));

//             try {
//                 await axios.post("/api/income", {
//                     totalHarga: totalHargaSetelahDiskon,
//                     item: count,
//                     category,
//                     nama: nama,
//                 });
//                 await axios.post("/api/history", {
//                     totalHarga: totalHargaSetelahDiskon,
//                     item: count,
//                     keterangan: "Terjual",
//                     category,
//                     nama: nama,
//                     icon: menuData[category].icon,
//                 });
//                 await updateStock(nama, count);

//                 Swal.fire({ title: "Success", text: `Data ${category} berhasil disimpan!`, icon: "success" });

//                 setMenuData((prev) => ({
//                     ...prev,
//                     [category]: { ...prev[category], harga: 0, count: 1, nama: "", diskon: 0 },
//                 }));
//             } catch (error) {
//                 console.error("Error sending data:", error);
//                 Swal.fire({ title: "Error", text: `Gagal mengirim data ${category}!`, icon: "error" });
//             } finally {
//                 setLoadingCategory((prev) => ({ ...prev, [category]: false }));
//             }
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

//             <div className="grid md:grid-cols-2 gap-6">
//                 {Object.entries(menuData).map(([category, data], index) => (
//                     <div key={index} className="flex flex-col align-center gap-6 p-6 rounded-3xl shadow-sm bg-white">
//                         <div className="flex items-center flex-col">
//                             <div className="w-full flex items-center justify-between">
//                                 <img src={data.icon} alt={`icon ${category}`} className="w-16" />
//                                 <span className="text-sm font-semibold capitalize text-[#B13069]">{data.nama}</span>
//                             </div>
//                             <div className="flex items-center gap-1 mt-2">
//                                 <span className="text-xl font-semibold text-green-500">Rp{new Intl.NumberFormat("id-ID").format((data.harga * data.count) - data.diskon)}</span>
//                                 <span className="text-gray-600">+ {data.count}</span>
//                             </div>
//                         </div>
//                         {category === "paket" ? (
//                             <div className="flex flex-col gap-4">
//                                 {Object.entries(packages).map(([key, options]) => (
//                                     <div key={key}>
//                                         <h3 className="font-semibold mb-2 text-sm text-gray-600">Pilih {key}</h3>

//                                         <div className="flex items-center">
//                                             <select
//                                                 value={selectedItems[key] ? `${selectedItems[key].packageName} - ${selectedItems[key].variant}` : ""}
//                                                 onChange={(e) => {
//                                                     const selectedPackage = e.target.value;
//                                                     const selectedItem = options.find((item) => `${item.packageName} - ${item.variant}` === selectedPackage);
//                                                     setSelectedItems((prev) => {
//                                                         const newSelectedItems = { ...prev, [key]: selectedItem || null };
//                                                         if (key === "kebab" && selectedItem) {
//                                                             newSelectedItems.burger = null;
//                                                         } else if (key === "burger" && selectedItem) {
//                                                             newSelectedItems.kebab = null;
//                                                         }
//                                                         return newSelectedItems;
//                                                     });
//                                                 }}
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-gray-600"
//                                                 disabled={
//                                                     (key === "burger" && selectedItems.kebab) ||
//                                                     (key === "kebab" && selectedItems.burger) ||
//                                                     (!isMainItemSelected && (key === "kentang" || key === "burgerManis" || key === "minuman"))
//                                                 }
//                                             >
//                                                 <option value="">Pilih {key} (Opsional)</option>
//                                                 {options.map((item, idx) => (
//                                                     <option key={idx} value={`${item.packageName} - ${item.variant}`}>
//                                                         {item.packageName} - {item.variant} (Rp{new Intl.NumberFormat("id-ID").format(item.price)})
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         </div>
//                                         <div className="flex justify-between mt-2">
//                                             {selectedItems[key] ? (
//                                                 <span className="text-sm text-green-500 mt-1">
//                                                     Harga: Rp{new Intl.NumberFormat("id-ID").format(selectedItems[key].price)}
//                                                 </span>
//                                             ) : (
//                                                 <span className="text-sm text-gray-500 mt-1">
//                                                     Harga: Rp{new Intl.NumberFormat("id-ID").format(0)}
//                                                 </span>
//                                             )
//                                             }

//                                             {/* Tombol Tambah dan kurang Paket */}
//                                             <div className="flex items-center gap-3">
//                                                 <button
//                                                     onClick={async () => {
//                                                         if (selectedItems[key]) {
//                                                             const confirmResult = await Swal.fire({
//                                                                 title: "Hapus Paket?",
//                                                                 text: `Apakah Anda yakin ingin menghapus paket "${selectedItems[key].packageName}"?`,
//                                                                 icon: "warning",
//                                                                 showCancelButton: true,
//                                                                 confirmButtonText: "Ya, Hapus",
//                                                                 cancelButtonText: "Batal",
//                                                                 confirmButtonColor: "#d33",
//                                                                 cancelButtonColor: "#3085d6",
//                                                             });

//                                                             if (confirmResult.isConfirmed) {
//                                                                 const updatedPackages = packages[key].filter(
//                                                                     (item) => `${item.packageName} - ${item.variant}` !== `${selectedItems[key].packageName} - ${selectedItems[key].variant}`
//                                                                 );
//                                                                 packages[key] = updatedPackages;
//                                                                 setMenuData((prev) => ({
//                                                                     ...prev,
//                                                                     [key]: { ...prev[key], items: updatedPackages },
//                                                                 }));
//                                                                 setSelectedItems((prev) => ({ ...prev, [key]: null }));

//                                                                 Swal.fire({
//                                                                     title: "Berhasil!",
//                                                                     text: "Paket berhasil dihapus.",
//                                                                     icon: "success",
//                                                                 });
//                                                             }
//                                                         } else {
//                                                             Swal.fire({
//                                                                 title: "Peringatan",
//                                                                 text: "Tidak ada paket yang dipilih untuk dihapus.",
//                                                                 icon: "warning",
//                                                             });
//                                                         }
//                                                     }}>
//                                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 text-red-500">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
//                                                     </svg>
//                                                 </button>

//                                                 <button
//                                                     onClick={async () => {
//                                                         const { value: formValues } = await Swal.fire({
//                                                             title: "Tambah Paket Baru",
//                                                             html:
//                                                                 `
//                                                                 <div>
//                                                                     <input id="packageName" class="swal2-input" placeholder="Nama Paket">
//                                                                     <input id="variant" class="swal2-input" placeholder="Varian">
//                                                                     <input id="price" class="swal2-input" placeholder="Harga" type="number">
//                                                                     <p class="text-md text-gray-500 mt-2">Varian harus sesuai dengan daftar menu.</p>
//                                                                 </div>
//                                                                 `,
//                                                             showCancelButton: true,
//                                                             confirmButtonText: "Tambah",
//                                                             cancelButtonText: "Batal",
//                                                             preConfirm: () => {
//                                                                 const packageName = document.getElementById("packageName").value;
//                                                                 const variant = document.getElementById("variant").value;
//                                                                 const price = parseFloat(document.getElementById("price").value);

//                                                                 // Validasi input
//                                                                 if (!packageName || !variant || isNaN(price)) {
//                                                                     Swal.showValidationMessage("Harap isi semua field dengan benar");
//                                                                     return false;
//                                                                 }

//                                                                 return { packageName, variant, price };
//                                                             },
//                                                         });

//                                                         if (formValues) {
//                                                             const newPackage = {
//                                                                 packageName: formValues.packageName,
//                                                                 variant: formValues.variant,
//                                                                 price: formValues.price,
//                                                             };

//                                                             // Tambahkan paket baru ke dalam daftar
//                                                             packages[key].push(newPackage);

//                                                             // Perbarui state menuData untuk memicu re-render
//                                                             setMenuData((prev) => ({
//                                                                 ...prev,
//                                                                 paket: {
//                                                                     ...prev.paket,
//                                                                     items: [...prev.paket.items, newPackage], // Tambahkan item baru ke paket
//                                                                 },
//                                                             }));

//                                                             Swal.fire({
//                                                                 title: "Berhasil!",
//                                                                 text: "Paket baru berhasil ditambahkan.",
//                                                                 icon: "success",
//                                                             });
//                                                         }
//                                                     }}
//                                                 >
//                                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 text-green-500">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
//                                                     </svg>
//                                                 </button>

//                                             </div>

//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="flex flex-wrap gap-2">
//                                 {data.items.map((item, idx) => (
//                                     <button
//                                         key={idx}
//                                         onClick={() => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], harga: item.price, nama: item.name } }))}
//                                         className="px-5 py-2 tracking-wide text-gray-800 capitalize text-sm bg-white rounded-full border border-gray-300 hover:bg-gray-200 transition-all"
//                                     >
//                                         {item.name}
//                                     </button>
//                                 ))}
//                             </div>
//                         )}

//                         <div className="flex flex-col gap-4">
//                             <div className="flex gap-4 items-center w-full justify-between">
//                                 <div className="flex gap-2 items-center">
//                                     <button
//                                         onClick={() => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], count: Math.max(0, data.count - 1) } }))}
//                                         className="p-2.5 border rounded-xl hover:bg-red-100 transition-all"
//                                     >
//                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4">
//                                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
//                                         </svg>
//                                     </button>

//                                     <input
//                                         type="tel"
//                                         inputMode="numeric"
//                                         pattern="[0-9]*"
//                                         value={data.count}
//                                         onChange={(e) => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], count: Math.max(0, parseInt(e.target.value.replace(/\D/g, "")) || 0) } }))}
//                                         className="border w-full h-10 text-center rounded-xl bg-gray-100 focus:outline-none focus:border-blue-500"
//                                     />

//                                     <button
//                                         onClick={() => setMenuData((prev) => ({ ...prev, [category]: { ...prev[category], count: data.count + 1 } }))}
//                                         className="p-2.5 border rounded-xl hover:bg-green-100 transition-all"
//                                     >
//                                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4">
//                                             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//                                         </svg>
//                                     </button>
//                                 </div>

//                                 <button
//                                     onClick={() => kirimKeIncome(category)}
//                                     disabled={loadingCategory[category]}
//                                     className={`px-5 py-2 border rounded-full font-semibold transition-all ${loadingCategory[category]
//                                         ? "bg-gray-400 cursor-not-allowed"
//                                         : "bg-green-200 hover:bg-green-300 text-gray-600 hover:text-white border-green-600"
//                                         }`}
//                                 >
//                                     {loadingCategory[category] ? "Mengirim..." : "Tambah"}
//                                 </button>
//                             </div>
//                             <div className="flex items-center gap-2 justify-between gap-4">
//                                 <span className="text-sm text-gray-600 font-semibold">Diskon:</span>
//                                 <input
//                                     type="tel"
//                                     inputMode="numeric"
//                                     pattern="[0-9]*"
//                                     value={new Intl.NumberFormat("id-ID").format(data.diskon || 0)}
//                                     onChange={(e) => {
//                                         const numericValue = parseInt(e.target.value.replace(/\D/g, ""), 10) || 0;
//                                         setMenuData((prev) => ({
//                                             ...prev,
//                                             [category]: {
//                                                 ...prev[category],
//                                                 diskon: numericValue
//                                             }
//                                         }));
//                                     }}
//                                     className="border w-full h-10 text-center rounded-xl bg-gray-100 focus:outline-none focus:border-blue-500"
//                                 />
//                             </div>

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

// Ikon untuk setiap kategori
const categoryIcons = {
    kebab: "https://img.icons8.com/bubbles/100/burrito.png",
    burger: "https://img.icons8.com/bubbles/100/hamburger.png",
    minuman: "https://img.icons8.com/bubbles/100/iced-coffee.png",
    paket: "https://img.icons8.com/bubbles/100/take-away-food.png",
};

export default function Menu() {
    const [menuData, setMenuData] = useState({
        kebab: { items: [], harga: 0, count: 1, nama: "", icon: categoryIcons.kebab, diskon: 0 },
        burger: { items: [], harga: 0, count: 1, nama: "", icon: categoryIcons.burger, diskon: 0 },
        minuman: { items: [], harga: 0, count: 1, nama: "", icon: categoryIcons.minuman, diskon: 0 },
        paket: { items: [], harga: 0, count: 1, nama: "Menu paket", selectedItems: [], icon: categoryIcons.paket, diskon: 0 },
    });

    const [loadingCategory, setLoadingCategory] = useState({
        kebab: false,
        burger: false,
        minuman: false,
        paket: false,
    });

    const categoryMapping = {
        kentang: "kebab",
        burgerManis: "burger",
        minuman: "minuman",
    };

    const [selectedItems, setSelectedItems] = useState({
        kebab: null,
        burger: null,
        kentang: null,
        burgerManis: null,
        minuman: null,
    });

    // Fetch data dari API
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [kebabRes, burgerRes, minumanRes, paketRes] = await Promise.all([
                    axios.get("/api/menuDas/kebab").catch(() => ({ data: [] })),
                    axios.get("/api/menuDas/burger").catch(() => ({ data: [] })),
                    axios.get("/api/menuDas/minuman").catch(() => ({ data: [] })),
                    axios.get("/api/menuPaket").catch(() => ({ data: [] })),
                ]);

                setMenuData((prev) => ({
                    ...prev,
                    kebab: { ...prev.kebab, items: kebabRes.data },
                    burger: { ...prev.burger, items: burgerRes.data },
                    minuman: { ...prev.minuman, items: minumanRes.data },
                    paket: { ...prev.paket, items: paketRes.data },
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
                Swal.fire({ title: "Error", text: "Gagal memuat menu, periksa koneksi Anda!", icon: "error" });
            }
        };

        fetchAllData();
    }, []);

    // Update stok
    const updateStock = async (nama, count) => {
        try {
            await axios.post("/api/updateStock", { menu_name: nama, count });
        } catch (error) {
            console.error("Error updating stock:", error);
        }
    };

    // Hitung total harga setelah diskon
    const calculateTotalPrice = () => {
        return Object.values(selectedItems).reduce((total, item) => total + (item?.price || 0), 0);
    };

    // Update total harga saat selectedItems berubah
    useEffect(() => {
        const totalHarga = calculateTotalPrice();
        setMenuData((prev) => ({ ...prev, paket: { ...prev.paket, harga: totalHarga } }));
    }, [selectedItems]);
    
    const tambahPaket = async (newPackage) => {
        try {
            const { data } = await axios.post('/api/menuPaket', newPackage);
            return data;
        } catch (error) {
            Swal.fire({ title: "Error", text: error.message, icon: "error" });
            throw error;
        }
    };
    
    const hapusPaket = async (id) => {
        try {
            const { data } = await axios.delete('/api/menuPaket', { data: { id } });
            return data;
        } catch (error) {
            Swal.fire({ title: "Error", text: error.message, icon: "error" });
            throw error;
        }
    };

    const kirimKeIncome = async (category) => {
        const { harga, count, nama, diskon } = menuData[category];

        if (category === "paket") {
            const totalHarga = calculateTotalPrice();
            const selectedItemsList = Object.entries(selectedItems)
                .map(([key, item]) => {
                    if (item) {
                        const updatedCategory = categoryMapping[key] || key;
                        return { ...item, category: updatedCategory };
                    }
                    return null;
                })
                .filter((item) => item !== null);

            if (selectedItemsList.length === 0) {
                Swal.fire({ title: "Peringatan", text: "Silakan pilih setidaknya satu item untuk paket!", icon: "warning" });
                return;
            }

            if (count < 1) {
                Swal.fire({ title: "Peringatan", text: "Jumlah harus lebih dari 0!", icon: "warning" });
                return;
            }

            // Hitung diskon per item dengan pembulatan
            const diskonPerItem = Math.floor(diskon / selectedItemsList.length);
            const sisaDiskon = diskon % selectedItemsList.length;

            const confirmResult = await Swal.fire({
                title: "Konfirmasi",
                text: `Apakah Anda yakin ingin menambahkan paket sebanyak ${count} dengan total harga Rp${new Intl.NumberFormat("id-ID").format(totalHarga * count - diskon)}?`,
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
                for (let i = 0; i < selectedItemsList.length; i++) {
                    const item = selectedItemsList[i];
                    const diskonItem = diskonPerItem + (i < sisaDiskon ? 1 : 0);
                    const hargaPerItemSetelahDiskon = item.price * count - diskonItem;

                    await axios.post("/api/income", {
                        totalHarga: hargaPerItemSetelahDiskon,
                        item: count,
                        category: item.category,
                        nama: item.variant,
                    });
                }

                await axios.post("/api/history", {
                    totalHarga: totalHarga * count - diskon,
                    item: count,
                    keterangan: "Terjual",
                    category: "paket",
                    nama: selectedItems.kebab ? selectedItems.kebab.packageName : selectedItems.burger ? selectedItems.burger.packageName : "",
                    icon: menuData[category].icon,
                });

                for (const item of selectedItemsList) {
                    await updateStock(item.variant, count);
                }

                Swal.fire({ title: "Success", text: `Data ${category} berhasil disimpan!`, icon: "success" });

                setMenuData((prev) => ({
                    ...prev,
                    [category]: { ...prev[category], harga: 0, count: 1, selectedItems: [], diskon: 0 },
                }));
                setSelectedItems({
                    kebab: null,
                    kentang: null,
                    burger: null,
                    burgerManis: null,
                    minuman: null,
                });
            } catch (error) {
                console.error("Error sending data:", error);
                Swal.fire({ title: "Error", text: `Gagal mengirim data ${category}!`, icon: "error" });
            } finally {
                setLoadingCategory((prev) => ({ ...prev, [category]: false }));
            }
        } else {
            if (!nama || count < 1) {
                Swal.fire({ title: "Peringatan", text: "Silakan pilih menu dan jumlah harus lebih dari 0!", icon: "warning" });
                return;
            }

            const totalHargaSetelahDiskon = harga * count - diskon;

            const confirmResult = await Swal.fire({
                title: "Konfirmasi",
                text: `Apakah Anda yakin ingin menambahkan ${category} ${nama} sebanyak ${count} dengan total harga Rp${new Intl.NumberFormat("id-ID").format(totalHargaSetelahDiskon)}?`,
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
                    totalHarga: totalHargaSetelahDiskon,
                    item: count,
                    category,
                    nama: nama,
                });
                await axios.post("/api/history", {
                    totalHarga: totalHargaSetelahDiskon,
                    item: count,
                    keterangan: "Terjual",
                    category,
                    nama: nama,
                    icon: menuData[category].icon,
                });
                await updateStock(nama, count);

                Swal.fire({ title: "Success", text: `Data ${category} berhasil disimpan!`, icon: "success" });

                setMenuData((prev) => ({
                    ...prev,
                    [category]: { ...prev[category], harga: 0, count: 1, nama: "", diskon: 0 },
                }));
            } catch (error) {
                console.error("Error sending data:", error);
                Swal.fire({ title: "Error", text: `Gagal mengirim data ${category}!`, icon: "error" });
            } finally {
                setLoadingCategory((prev) => ({ ...prev, [category]: false }));
            }
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

            <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(menuData).map(([category, data], index) => (
                    <div key={index} className="flex flex-col align-center gap-6 p-6 rounded-3xl shadow-sm bg-white">
                        <div className="flex items-center flex-col">
                            <div className="w-full flex items-center justify-between">
                                <img src={data.icon} alt={`icon ${category}`} className="w-16" />
                                <span className="text-sm font-semibold capitalize text-[#B13069]">{data.nama}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                                <span className="text-xl font-semibold text-green-500">Rp{new Intl.NumberFormat("id-ID").format((data.harga * data.count) - data.diskon)}</span>
                                <span className="text-gray-600">+ {data.count}</span>
                            </div>
                        </div>
                        {category === "paket" ? (
                            <div className="flex flex-col gap-4">
                                {Array.isArray(menuData.paket.items) &&
                                    // Gunakan Set untuk menghindari duplikasi kategori
                                    [...new Set(menuData.paket.items.map((item) => item.category))]
                                        .map((category, idx) => {
                                            // Ambil item pertama untuk kategori ini (hanya untuk judul dropdown)
                                            const firstItem = menuData.paket.items.find((item) => item.category === category);

                                            return (
                                                <div key={idx}>
                                                    <h3 className="font-semibold mb-2 text-sm text-gray-600">Pilih {category}</h3>
                                                    <div className="flex items-center">
                                                        <select
                                                            value={selectedItems[category] ? `${selectedItems[category].packageName} - ${selectedItems[category].variant}` : ""}
                                                            onChange={(e) => {
                                                                const selectedPackage = e.target.value;
                                                                const selectedItem = menuData.paket.items.find(
                                                                    (pkg) => `${pkg.packageName} - ${pkg.variant}` === selectedPackage
                                                                );
                                                                setSelectedItems((prev) => ({ ...prev, [category]: selectedItem || null }));
                                                            }}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-gray-600"
                                                        >
                                                            <option value="">Pilih {category} (Opsional)</option>
                                                            {menuData.paket.items
                                                                .filter((pkg) => pkg.category === category)
                                                                .map((pkg, idx) => (
                                                                    <option key={idx} value={`${pkg.packageName} - ${pkg.variant}`}>
                                                                        {pkg.packageName} - {pkg.variant} (Rp{new Intl.NumberFormat("id-ID").format(pkg.price)})
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex justify-between mt-2">
                                                        {selectedItems[category] ? (
                                                            <span className="text-sm text-green-500 mt-1">
                                                                Harga: Rp{new Intl.NumberFormat("id-ID").format(selectedItems[category].price)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-sm text-gray-500 mt-1">
                                                                Harga: Rp{new Intl.NumberFormat("id-ID").format(0)}
                                                            </span>
                                                        )}

                                                        {/* Tombol tambah dan hapus */}
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={async () => {
                                                                    if (selectedItems[category]) {
                                                                        const confirmResult = await Swal.fire({
                                                                            title: "Hapus Paket?",
                                                                            text: `Apakah Anda yakin ingin menghapus paket "${selectedItems[category].packageName}"?`,
                                                                            icon: "warning",
                                                                            showCancelButton: true,
                                                                            confirmButtonText: "Ya, Hapus",
                                                                            cancelButtonText: "Batal",
                                                                            confirmButtonColor: "#d33",
                                                                            cancelButtonColor: "#3085d6",
                                                                        });

                                                                        if (confirmResult.isConfirmed) {
                                                                            try {
                                                                                await hapusPaket(selectedItems[category].id);
                                                                                // Refresh data setelah menghapus
                                                                                const updatedItems = menuData.paket.items.filter(
                                                                                    (item) => item.id !== selectedItems[category].id
                                                                                );
                                                                                setMenuData((prev) => ({
                                                                                    ...prev,
                                                                                    paket: { ...prev.paket, items: updatedItems },
                                                                                }));
                                                                                setSelectedItems((prev) => ({ ...prev, [category]: null })); // Reset selected item
                                                                                Swal.fire({ title: "Success", text: "Paket berhasil dihapus!", icon: "success" });
                                                                            } catch (error) {
                                                                                // Error sudah ditangani di fungsi hapusPaket
                                                                            }
                                                                        }
                                                                    } else {
                                                                        Swal.fire({
                                                                            title: "Peringatan",
                                                                            text: "Tidak ada paket yang dipilih untuk dihapus.",
                                                                            icon: "warning",
                                                                        });
                                                                    }
                                                                }}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 text-red-500">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                                </svg>
                                                            </button>

                                                            <button
                                                                onClick={async () => {
                                                                    const { value: formValues } = await Swal.fire({
                                                                        title: "Tambah Paket Baru",
                                                                        html:
                                                                            `
                                                                            <div>
                                                                                <input id="packageName" class="swal2-input" placeholder="Nama Paket">
                                                                                <input id="variant" class="swal2-input" placeholder="Varian">
                                                                                <input id="price" class="swal2-input" placeholder="Harga" type="number">
                                                                                <p class="text-md text-gray-500 mt-2">Varian harus sesuai dengan daftar menu.</p>
                                                                                <p class="text-md text-gray-500 mt-2">Nama Paket tanpa simbol - </p>
                                                                            </div>
                                                                            `,
                                                                        showCancelButton: true,
                                                                        confirmButtonText: "Tambah",
                                                                        cancelButtonText: "Batal",
                                                                        preConfirm: () => {
                                                                            const packageName = document.getElementById("packageName").value;
                                                                            const variant = document.getElementById("variant").value;
                                                                            const price = parseFloat(document.getElementById("price").value);

                                                                            if (!packageName || !variant || isNaN(price)) {
                                                                                Swal.showValidationMessage("Harap isi semua field dengan benar");
                                                                                return false;
                                                                            }

                                                                            return { packageName, variant, price, category };
                                                                        },
                                                                    });

                                                                    if (formValues) {
                                                                        try {
                                                                            const newPackage = await tambahPaket(formValues);
                                                                            // Tambahkan paket baru ke state
                                                                            setMenuData((prev) => ({
                                                                                ...prev,
                                                                                paket: { ...prev.paket, items: [...prev.paket.items, newPackage.data] },
                                                                            }));
                                                                            Swal.fire({ title: "Success", text: "Paket berhasil ditambahkan!", icon: "success" });
                                                                        } catch (error) {
                                                                            // Error sudah ditangani di fungsi tambahPaket
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 text-green-500">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
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

                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4 items-center w-full justify-between">
                                <div className="flex gap-2 items-center">
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
                                        className="border w-full h-10 text-center rounded-xl bg-gray-100 focus:outline-none focus:border-blue-500"
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
                                        : "bg-green-200 hover:bg-green-300 text-gray-600 hover:text-white border-green-600"
                                        }`}
                                >
                                    {loadingCategory[category] ? "Mengirim..." : "Tambah"}
                                </button>
                            </div>
                            <div className="flex items-center gap-2 justify-between gap-4">
                                <span className="text-sm text-gray-600 font-semibold">Diskon:</span>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={new Intl.NumberFormat("id-ID").format(data.diskon || 0)}
                                    onChange={(e) => {
                                        const numericValue = parseInt(e.target.value.replace(/\D/g, ""), 10) || 0;
                                        setMenuData((prev) => ({
                                            ...prev,
                                            [category]: {
                                                ...prev[category],
                                                diskon: numericValue
                                            }
                                        }));
                                    }}
                                    className="border w-full h-10 text-center rounded-xl bg-gray-100 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}