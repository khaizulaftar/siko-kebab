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

    const handlePriceChange = async (id, name) => {
        const newStock = inputRefs.current[id]?.value.replace(/\./g, "")
        const stockInt = Math.floor(Number(newStock))

        if (isNaN(stockInt) || stockInt <= 0) {
            return Swal.fire({
                icon: "error",
                title: "Harga tidak valid",
                text: "Harap masukkan harga yang valid.",
            })
        }

        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Harga akan diubah!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, ubah harga",
            cancelButtonText: "Batal",
        })

        if (!result.isConfirmed) return

        try {
            await axios.put("/api/stockSet", { id, stock: stockInt })

            await axios.post("/api/history", {
                totalHarga: stockInt,
                item: "change",
                category: "",
                nama: name,
                icon: "https://img.icons8.com/ultraviolet/50/available-updates.png"
            })

            await refreshMenus()
            setEditingId(null)

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Harga telah diperbarui dan riwayat tersimpan.",
            })

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal memperbarui harga",
                text: "Silakan coba lagi.",
            })
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
                {filteredMenus.map(({ id, name, stock, dose, initial_stock, final_stock, out_stock }) => (
                    <div key={id} className="p-6 flex flex-col border rounded-3xl bg-white">
                        <span className="font-semibold text-xl mb-3">{name}</span>
                        <div className="flex flex-col text-center items-center">
                            <span className="capitalize font-semibold text-gray-600">jumlah Stock</span>
                            <div className="flex gap-1 items-center">
                                <span className="font-semibold text-xl">{formatNumber(stock)}</span>
                                <span className="text-lg font-semibold">|</span>
                                <span className="text-xl font-semibold">{dose}</span>
                            </div>
                            {editingId === id ? (
                                <div className="relative mt-3 w-full">
                                    <input
                                        type="text"
                                        className="block w-full px-6 py-3 text-md border rounded-xl focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                                        placeholder="Ubah harga barang"
                                        ref={(el) => (inputRefs.current[id] = el)}
                                        onInput={(e) => {
                                            let value = e.target.value.replace(/\D/g, "")
                                            e.target.value = formatNumber(value)
                                        }}
                                    />
                                    <button
                                        onClick={() => handlePriceChange(id, name)}
                                        className="absolute end-1.5 bottom-1.5 rounded-full bg-green-100 px-5 py-2.5 p text-xs border border-green-600 transition focus:ring-3 focus:outline-hidden"
                                    >
                                        Ubah bahan
                                    </button>
                                </div>
                            ) : (
                                user?.role === "admin" && (
                                    <button
                                        onClick={() => setEditingId(id)}
                                        className="flex items-center justify-center mt-3 rounded-full bg-green-100 p-2 text-sm border border-green-600 transition duration-300 hover:scale-105 focus:ring-3 focus:outline-hidden w-full capitalize"
                                    >
                                        ubah jumlah bahan
                                    </button>
                                )
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
    )
}