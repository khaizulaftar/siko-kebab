"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import moment from "moment-timezone";
import Loading from "../dashboard/loading";

export default function HistoryPage() {
    const [history, setHistory] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [user, setUser] = useState(null); // State untuk menyimpan data pengguna
    const router = useRouter();

    // Fetch data history dan profil pengguna saat komponen dimuat
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            setIsAuthenticated(false);
            router.push("/login");
            return;
        }

        axios
            .get("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
            .then(({ data: { user = {} } }) => {
                setUser(user); // Simpan data pengguna ke state
                setIsAuthenticated(true);
                return axios.get("/api/history", { headers: { Authorization: `Bearer ${token}` } });
            })
            .then(({ data }) => data && setHistory(data)) // Set data history jika ada
            .catch(() => {
                setIsAuthenticated(false);
                router.push("/login");
            })
            .finally(() => setIsLoading(false)); // Set loading selesai
    }, [router]);


    // Fungsi untuk menghapus history
    const handleDeleteHistory = async (id) => {
        if (showDeleteAlert || user?.role !== "admin") return; // Hanya admin yang bisa menghapus
    
        try {
            setShowDeleteAlert(true);
    
            const result = await Swal.fire({
                title: "Apakah Anda yakin?",
                text: "Anda tidak dapat mengembalikan data yang telah dihapus!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#EF4444",
                cancelButtonColor: "#3B82F6",
                confirmButtonText: "Ya, hapus!",
                cancelButtonText: "Batal",
            });
    
            if (result.isConfirmed) {
                await axios.delete("/api/history", {
                    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
                    data: { id },
                });
                Swal.fire("Dihapus!", "Data history telah dihapus.", "success");
    
                // Refresh data history setelah menghapus
                const response = await axios.get("/api/history", {
                    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
                });
                setHistory(response.data);
            }
        } catch {
            Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus data.", "error");
        } finally {
            setShowDeleteAlert(false);
        }
    };

    // Fungsi untuk menampilkan detail history
    const showDetailHistory = (item) => {
        Swal.fire({
            title: "Detail History",
            html: `
            <div class="flex flex-col gap-3">
                <div class="flex justify-between">
                    <span class="font-semibold">Tanggal:</span>
                    <span>${moment(item.tanggal).locale("id").format("dddd, DD MMMM YYYY")}</span>
                </div>
                <div class="flex justify-between">
                    <span class="font-semibold">Kategori:</span>
                    <span>${item.category}</span>
                </div>
                <div class="flex justify-between">
                    <span class="font-semibold">Nama:</span>
                    <span>${item.name}</span>
                </div>
                <div class="flex justify-between">
                    <span class="font-semibold">Jumlah Pemasukan:</span>
                    <span>${item.jumlah_pemasukan ? new Intl.NumberFormat("id-ID").format(Number(item.jumlah_pemasukan)) : "-"}</span>
                </div>
                <div class="flex justify-between">
                    <span class="font-semibold">Item:</span>
                    <span>${item.item || "-"}</span>
                </div>
                <div class="flex justify-between">
                    <span class="font-semibold">Keterangan:</span>
                    <span>${item.keterangan || "-"}</span>
                </div>
            </div>
        `,
            showCancelButton: user?.role === "admin", // Tampilkan tombol hapus hanya jika admin
            confirmButtonText: user?.role === "admin" ? "Hapus" : "Tutup", // Ubah teks tombol berdasarkan role
            cancelButtonText: "Tutup",
            confirmButtonColor: "#3B82F6",
            cancelButtonColor: "#B12D67",
            showCloseButton: true,
            preConfirm: () => {
                if (user?.role === "admin") {
                    handleDeleteHistory(item.id);
                }
            },
        });
    };

    // Redirect ke halaman login jika tidak terautentikasi
    if (isAuthenticated === false) return <Loading />;

    // Tampilkan loading spinner jika data masih dimuat
    if (isLoading) return <Loading />;

    // Filter data history berdasarkan query pencarian
    const filteredHistory = Object.entries(history)
        .slice()
        .reverse()
        .map(([date, items]) => [
            date,
            items.filter((item) => {
                const searchLower = searchQuery.toLowerCase();
                return (
                    item.category.toLowerCase().includes(searchLower) ||
                    item.name.toLowerCase().includes(searchLower) ||
                    date.toLowerCase().includes(searchLower)
                );
            }),
        ])
        .filter(([_, items]) => items.length > 0);

    return (
        <div className="max-w-4xl mx-auto min-h-screen">
            {/* Search Bar */}
            <div className="w-full pb-3 pt-6 bg-[#F4F5F7] sticky top-0 flex items-center">
                <input
                    type="text"
                    placeholder="Cari berdasarkan kategori, nama, atau tanggal"
                    className="mx-4 placeholder-gray-400/70 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* History List */}
            <div className="mt-3 mb-20 sm:mb-6 mx-4">
                {filteredHistory.map(([date, items]) => (
                    <div key={date} className="mb-12">
                        <p className="capitalize font-semibold text-sm mb-4 text-gray-700">{date}</p>
                        <div className="grid grid-1 sm:grid-cols-2 gap-3 rounded-3xl shadow-sm p-6 bg-white">
                            {items.slice().reverse().map((value) => (
                                <div
                                    key={value.id}
                                    className="flex items-center gap-2 cursor-pointer"
                                    onClick={() => showDetailHistory(value)}
                                >
                                    {value.icon && <img src={value.icon} alt="icon" className="w-12" />}
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-sm capitalize font-semibold text-gray-700">
                                                    {value.category}
                                                </span>
                                                <span className="text-xs capitalize">{value.name}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                {value.jumlah_pemasukan && Number(value.jumlah_pemasukan) !== 0 && (
                                                    <span className="text-sm font-semibold text-[#B13069]">
                                                        {new Intl.NumberFormat("id-ID").format(Number(value.jumlah_pemasukan))}
                                                    </span>
                                                )}
                                                {value.item && <span className="text-sm text-green-500">{`+ ${value.item}`}</span>}
                                                <span className="text-xs text-gray-600 text-end">{value.keterangan}</span>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}