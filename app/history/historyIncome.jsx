// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import moment from "moment-timezone";
// import Loading from "../dashboard/loading";

// export default function HistoryIncome() {
//     const [incomeData, setIncomeData] = useState([]); // State untuk menyimpan data income
//     const [isLoading, setIsLoading] = useState(true); // State untuk loading
//     const [limit, setLimit] = useState(12); // State untuk jumlah data yang ditampilkan

//     // Fungsi untuk mengambil data income dari API
//     const fetchIncomeData = async () => {
//         try {
//             const response = await axios.get("/api/incomeHistory"); // Gunakan endpoint API yang sudah ada
//             if (response.data.success) {
//                 // Simpan semua data ke state
//                 setIncomeData(response.data.data);
//             } else {
//                 // Jika tidak ada data, tampilkan pesan
//                 Swal.fire("Info", response.data.message, "info");
//             }
//         } catch (error) {
//             Swal.fire("Error!", "Gagal mengambil data income.", "error");
//         } finally {
//             setIsLoading(false); // Set loading selesai
//         }
//     };

//     // Ambil data saat komponen dimuat
//     useEffect(() => {
//         fetchIncomeData();
//     }, []);

//     // Format tanggal menggunakan moment-timezone
//     const formatDate = (date) => {
//         return moment(date).locale("id").format("dddd, DD MMMM YYYY");
//     };

//     // Tampilkan loading spinner jika data masih dimuat
//     if (isLoading) {
//         return <Loading/>;
//     }

//     // Tampilkan pesan jika tidak ada data
//     if (incomeData.length === 0) {
//         return <div className="text-center py-8">Tidak ada data income.</div>;
//     }

//     return (
//         <div className="max-w-4xl mx-auto p-4">
//             {/* Daftar Income */}
//             <div className="sm:grid grid-cols-2 gap-4">
//                 {incomeData.slice(0, limit).map((income) => ( // Batasi data yang ditampilkan
//                     <div key={income.id} className="p-6 rounded-3xl shadow-sm bg-white">
//                         <div className="flex justify-between items-center">
//                             <div>
//                                 <p className="font-semibold">{income.category}</p>
//                                 <p className="text-sm text-gray-600">{income.name}</p>
//                             </div>
//                             <div className="text-right">
//                                 <p className="text-sm text-gray-600">
//                                     {formatDate(income.tanggal)}
//                                 </p>
//                                 <p className="font-semibold text-green-600">
//                                     {new Intl.NumberFormat("id-ID", {
//                                         style: "currency",
//                                         currency: "IDR",
//                                     }).format(income.jumlah_pemasukan)}
//                                 </p>
//                             </div>
//                         </div>
//                         {income.keterangan && (
//                             <p className="text-sm text-gray-500 mt-2">
//                                 Keterangan: {income.keterangan}
//                             </p>
//                         )}
//                     </div>
//                 ))}
//             </div>

//             {/* Tombol untuk menampilkan lebih banyak data */}
//             {incomeData.length > limit && (
//                 <div className="text-center mt-6">
//                     <button
//                         onClick={() => setLimit(limit + 12)} // Tambah limit
//                         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//                     >
//                         Tampilkan Lebih Banyak
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment-timezone";
import Loading from "../dashboard/loading";

export default function HistoryIncome() {
    const [groupedData, setGroupedData] = useState([]); // State untuk menyimpan data yang sudah dikelompokkan
    const [isLoading, setIsLoading] = useState(true); // State untuk loading
    const [limit, setLimit] = useState(1); // State untuk jumlah data yang ditampilkan (default: 2 tanggal)
    const [showScrollButton, setShowScrollButton] = useState(false); // State untuk menampilkan tombol scroll

    // Fungsi untuk mengambil data income dari API
    const fetchIncomeData = async () => {
        try {
            const response = await axios.get("/api/incomeHistory"); // Gunakan endpoint API yang sudah ada
            if (response.data.success) {
                // Simpan data yang sudah dikelompokkan ke state
                setGroupedData(response.data.data);
            } else {
                // Jika tidak ada data, tampilkan pesan
                Swal.fire("Info", response.data.message, "info");
            }
        } catch (error) {
            Swal.fire("Error!", "Gagal mengambil data income.", "error");
        } finally {
            setIsLoading(false); // Set loading selesai
        }
    };

    // Ambil data saat komponen dimuat
    useEffect(() => {
        fetchIncomeData();
    }, []);

    // Format tanggal menggunakan moment-timezone
    const formatDate = (date) => {
        return moment(date).locale("id").format("dddd, DD MMMM YYYY");
    };

    // Fungsi untuk menangani scroll
    useEffect(() => {
        const handleScroll = () => {
            // Tampilkan tombol jika pengguna telah scroll ke bawah
            if (window.scrollY > 200) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        // Tambahkan event listener untuk scroll
        window.addEventListener("scroll", handleScroll);

        // Bersihkan event listener saat komponen di-unmount
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fungsi untuk kembali ke atas
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Animasi scroll yang halus
        });
    };

    // Tampilkan loading spinner jika data masih dimuat
    if (isLoading) {
        return <Loading />;
    }

    // Tampilkan pesan jika tidak ada data
    if (groupedData.length === 0) {
        return <div className="text-center py-8">Tidak ada data income.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Tampilkan data yang sudah dikelompokkan berdasarkan tanggal */}
            {groupedData.slice(0, limit).map((group) => (
                <div key={group.tanggal} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        {formatDate(group.tanggal)}
                    </h2>

                    {/* Tampilkan item untuk tanggal tersebut */}
                    <div className="sm:grid grid-cols-2 gap-4">
                        {group.items.map((item) => (
                            <div key={item.id} className="p-6 rounded-3xl shadow-sm bg-white">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-sm text-gray-600">{item.category}</p>
                                        <p className="text-xs text-gray-600">{item.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-sm text-green-600">
                                            Rp{item.jumlah_pemasukan ? item.jumlah_pemasukan.toLocaleString("id-ID") : "0"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {item.item}
                                        </p>
                                    </div>
                                </div>
                                {item.keterangan && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Keterangan: {item.keterangan}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Tombol untuk menampilkan lebih banyak data */}
            {groupedData.length > limit && (
                <div className="text-center mt-6">
                    <button
                        onClick={() => setLimit(limit + 1)} // Tambah limit (2 tanggal per klik)
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Tampilkan Lebih Banyak
                    </button>
                </div>
            )}

            {/* Tombol "Kembali ke Atas" */}
            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 p-2 backdrop-blur-xl text-white rounded-full shadow-lg hover:bg-gray-200 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
            )}
        </div>
    );
}