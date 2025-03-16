"use client"

import { useState, useRef } from "react"
import useSWR from "swr"
import axios from "axios"
import Swal from "sweetalert2"
import Loading from "../dashboard/loading"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function Stock() {
    const router = useRouter()
    const token = Cookies.get("token")

    const { data: menus = [], mutate: refreshMenus } = useSWR("/api/stockSet",
        () => axios.get("/api/stockSet").then(res => res.data),
        { refreshInterval: 5000 }
    )

    const { data: user } = useSWR("/api/auth/profile", () =>
        axios.get("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.data.user)
    )

    const [searchQuery, setSearchQuery] = useState("")
    const inputRefs = useRef({})
    const [editingId, setEditingId] = useState(null)

    if (!token) {
        router.push("/login")
        return <Loading />
    }

    const formatNumber = (number) => new Intl.NumberFormat("id-ID").format(number)

    const handleStockChange = async (id, name, currentStock, action) => {
        const inputValue = inputRefs.current[id]?.value.replace(/\./g, "")
        const changeValue = parseInt(inputValue, 10)

        if (isNaN(changeValue) || changeValue <= 0) {
            return Swal.fire({
                icon: "error",
                title: "Nilai tidak valid",
                text: "Harap masukkan nilai yang valid (angka positif).",
            })
        }

        const newStock = action === "increase" ? currentStock + changeValue : currentStock - changeValue

        if (newStock < 0) {
            return Swal.fire({
                icon: "error",
                title: "Jumlah tidak valid",
                text: "Stok tidak boleh kurang dari 0.",
            })
        }

        if (user?.role === "staf" && action === "decrease") {
            return Swal.fire({
                icon: "error",
                title: "Akses Ditolak",
                text: "Staff hanya bisa menambah stok, bukan mengurangi.",
            })
        }

        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: `Stok akan di${action === "increase" ? "tambah" : "kurang"}i sebanyak ${formatNumber(changeValue)}!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Ya, ${action === "increase" ? "tambah" : "kurang"}i stok`,
            cancelButtonText: "Batal",
            confirmButtonColor: "#3B82F6",
            cancelButtonColor: "#B12D67",
        })

        if (!result.isConfirmed) return

        try {
            await axios.put("/api/stockSet", { id, stock: newStock })
            await refreshMenus()
            inputRefs.current[id].value = ""
            setEditingId(null)

            // Simpan ke history
            await axios.post("/api/history", {
                totalHarga: changeValue, // Tidak terkait pemasukan
                item: null,
                keterangan: `${action === "increase" ? "ditambah" : "dikurangi"}`,
                category: "stok",
                nama: name,
                icon: action === "increase" ? "https://img.icons8.com/bubbles/50/plus.png" : "https://img.icons8.com/bubbles/50/minus.png"
            });

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: `Stok telah di${action === "increase" ? "tambah" : "kurang"}i sebanyak ${formatNumber(changeValue)}`,
            })

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal memperbarui stok",
                text: "Silakan coba lagi.",
            })
        }
    }

    const handleEditPrice = async (id, name, currentPrice) => {
        const { value: newPrice } = await Swal.fire({
            title: `Ubah harga untuk ${name}`,
            input: "text",
            inputValue: formatNumber(currentPrice),
            inputAttributes: {
                autocapitalize: "off",
                type: "tel",
                inputmode: "numeric"
            },
            showCancelButton: true,
            confirmButtonText: "Simpan",
            cancelButtonText: "Batal",
            confirmButtonColor: "#3B82F6",
            cancelButtonColor: "#B12D67",
            didOpen: () => {
                const input = Swal.getInput();
                input.setAttribute("type", "tel");
                input.setAttribute("inputmode", "numeric");
                input.addEventListener("input", () => {
                    let rawValue = input.value.replace(/\D/g, ""); // Hanya angka
                    input.value = formatNumber(Number(rawValue)); // Format angka ke ribuan
                });
            },
            preConfirm: (value) => value.replace(/\D/g, ""), // Hapus semua non-digit sebelum dikirim
        })

        if (!newPrice) return;

        try {
            await axios.put("/api/stockSet", { id, price: Number(newPrice) });
            await refreshMenus();

            // Simpan ke history
            await axios.post("/api/history", {
                totalHarga: newPrice,
                item: null,
                keterangan: 'diubah',
                category: "harga",
                nama: name,
                icon: "https://img.icons8.com/bubbles/50/summer-sales.png"
            });

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Harga telah diperbarui.",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal memperbarui harga",
                text: "Silakan coba lagi.",
            });
        }
    }

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const filteredMenus = menus.filter(menu =>
        menu.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (!menus.length) {
        return <Loading />
    }

    return (
        <div className="max-w-4xl mx-auto min-h-screen">
            <div className="w-full pb-3 pt-6 bg-[#F4F5F7] sticky top-0 flex items-center">
                <input
                    type="text"
                    placeholder="Cari berdasarkan nama"
                    className="mx-4 placeholder-gray-400/70 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 w-full"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mx-4 mt-3 mb-20 sm:mb-6">
                {filteredMenus.map(({ id, name, stock, dose, initial_stock, final_stock, out_stock, price }) => (
                    <div key={id} className="p-6 flex flex-col rounded-3xl shadow-sm bg-white">
                        <span className="font-semibold text-[#B12D67] text-md mb-3">{name}</span>
                        <div className="flex flex-col text-center items-center">
                            <div className="flex gap-1 items-center">
                                <span className="font-semibold text-lg text-gray-600">{formatNumber(stock)}</span>
                                <span className="text-lg font-semibold text-gray-600">|</span>
                                <span className="text-lg font-semibold text-gray-600">{dose}</span>
                            </div>
                            <div className="mt-3 flex gap-4 w-full">
                                <button
                                    onClick={() => handleStockChange(id, name, stock, "decrease")}
                                    className="flex items-center justify-center rounded-xl bg-red-100 px-4 text-sm border border-red-600 transition duration-300 hover:scale-105 focus:ring-3 focus:outline-hidden"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 text-gray-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                    </svg>
                                </button>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    className="block w-full px-6 py-2.5 text-md border rounded-xl focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                                    placeholder="Masukkan nilai"
                                    ref={(el) => (inputRefs.current[id] = el)}
                                    onInput={(e) => {
                                        let value = e.target.value.replace(/\D/g, ""); // Hanya angka
                                        e.target.value = formatNumber(value); // Format angka ke ribuan
                                    }}
                                />
                                <button
                                    onClick={() => handleStockChange(id, name, stock, "increase")}
                                    className="flex items-center justify-center rounded-xl bg-green-100 px-4 text-sm border border-green-600 transition duration-300 hover:scale-105 focus:ring-3 focus:outline-hidden"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 text-gray-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm capitalize">stok awal</span>
                                <div className="flex gap-1">
                                    <span className="text-sm">{formatNumber(initial_stock)}</span>
                                    <span className="text-sm">|</span>
                                    <span className="text-sm">{dose}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm capitalize">jumlah masuk</span>
                                <div className="flex gap-1">
                                    <span className="text-sm">{formatNumber(final_stock)}</span>
                                    <span className="text-sm">|</span>
                                    <span className="text-sm">{dose}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm capitalize">jumlah habis</span>
                                <div className="flex gap-1">
                                    <span className="text-sm">{formatNumber(out_stock)}</span>
                                    <span className="text-sm">|</span>
                                    <span className="text-sm">{dose}</span>
                                </div>
                            </div>
                        </div>
                        {user?.role === "admin" &&
                            <>
                                <hr className="my-3 border-2 border-dashed" />
                                <div className="flex flex-col text-center items-center">
                                    <div className="flex items-center w-full justify-between">
                                        <div className="flex items-center gap-1">
                                            <span className="text-md font-semibold text-gray-600">Rp{formatNumber(price)}</span>
                                            <span className="text-md font-semibold text-gray-600">|</span>
                                            <span className="text-md font-semibold text-gray-600">{dose}</span>
                                        </div>
                                        <button onClick={() => handleEditPrice(id, name, price)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 text-md font-semibold text-blue-400 hover:scale-110 transition">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 mt-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm capitalize">jumlah awal</span>
                                        <span className="text-green-500 text-sm">Rp{formatNumber(stock * price)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm capitalize">jumlah habis</span>
                                        <span className="text-green-500 text-sm">Rp{formatNumber(out_stock * price)}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-t-2 border-dashed pt-2">
                                        <span className="text-sm capitalize">selisih</span>
                                        <span className="text-gray-500 text-sm">Rp{formatNumber((stock - out_stock) * price)}</span>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}