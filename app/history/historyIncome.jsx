"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import moment from "moment-timezone"
import Loading from "../dashboard/loading"
import useSWR from "swr"
import Cookies from "js-cookie"

export default function HistoryIncome() {
    const [groupedData, setGroupedData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [limit, setLimit] = useState(1)
    const [showScrollButton, setShowScrollButton] = useState(false)
    const token = Cookies.get("token")

    const { data: user } = useSWR("/api/auth/profile", () =>
        axios
            .get("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.data.user)
    )

    const fetchIncomeData = async () => {
        try {
            const response = await axios.get("/api/incomeHistory")
            console.log("Data dari API:", response.data.data) // Debug data
            if (response.data.success) {
                // Urutkan grup berdasarkan tanggal (dari yang terbaru ke terlama)
                const sortedData = response.data.data
                    .map(group => ({
                        ...group,
                        // Urutkan items dalam setiap grup berdasarkan ID (dari yang terbaru ke terlama)
                        items: group.items.sort((a, b) => b.id - a.id)
                    }))
                    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)) // Urutkan grup berdasarkan tanggal

                setGroupedData(sortedData)
            } else {
                Swal.fire("Info", response.data.message, "info")
            }
        } catch (error) {
            Swal.fire("Error!", "Gagal mengambil data income.", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const deleteIncome = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Apakah Anda yakin?",
                text: "Anda tidak akan dapat mengembalikan data ini!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#EF4444",
                cancelButtonColor: "#3B82F6",
                confirmButtonText: "Ya, hapus!",
                cancelButtonText: "Batal",
            })

            if (result.isConfirmed) {
                const response = await axios.delete("/api/incomeHistory", { data: { id } })

                // Cari data yang dihapus
                const deletedItem = groupedData
                    .flatMap(group => group.items)
                    .find(item => item.id === id)

                if (deletedItem) {
                    await axios.post("/api/history", {
                        totalHarga: deletedItem.jumlah_pemasukan,
                        item: null,
                        keterangan: "income di hapus",
                        category: deletedItem.category,
                        nama: deletedItem.name,
                        icon: "https://img.icons8.com/bubbles/100/delete.png",
                    })
                }

                if (response.data.success) {
                    Swal.fire("Dihapus!", "Data income telah dihapus.", "success")
                    // Perbarui state setelah penghapusan
                    setGroupedData((prevData) =>
                        prevData.map((group) => ({
                            ...group,
                            items: group.items.filter((item) => item.id !== id),
                        })).filter((group) => group.items.length > 0)
                    )
                }
            }
        } catch (error) {
            Swal.fire("Error!", "Gagal menghapus data income.", "error")
        }
    }

    useEffect(() => {
        fetchIncomeData()
    }, [])

    const formatDate = (date) => {
        return moment(date).locale("id").format("dddd, DD MMMM YYYY")
    }

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 200)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    if (isLoading) {
        return <Loading />
    }

    if (groupedData.length === 0) {
        return <div className="text-center py-8">Tidak ada data income.</div>
    }

    return (
        <div className="max-w-4xl mx-auto p-4 min-h-screen mb-4 sm:mb-0">
            {groupedData.slice(0, limit).map((group) => (
                <div key={group.tanggal} className="mb-6">
                    <h2 className="text-sm text-gray-700 font-semibold mb-4">
                        {formatDate(group.tanggal)}
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4 mb-12">
                        {group.items.map((item) => (
                            <div key={item.id} className="p-6 rounded-3xl shadow-sm bg-white">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-sm text-gray-600">{item.category}</p>
                                        <p className="text-xs text-gray-600">{item.name}</p>
                                    </div>
                                    <div className="text-right flex items-center gap-2">
                                        <div>
                                            <p className="font-semibold text-sm text-green-500">
                                                Rp{item.jumlah_pemasukan ? item.jumlah_pemasukan.toLocaleString("id-ID") : "0"}
                                            </p>
                                            <p className="text-sm text-gray-600">{item.item}</p>
                                        </div>

                                        {user?.role === "admin" && (
                                            <button
                                                onClick={() => deleteIncome(item.id)}
                                                className="text-sm text-red-400 hover:text-red-600"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        )}
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

            {groupedData.length > limit && (
                <div className="text-center mb-16 sm:mb-0">
                    <button
                        onClick={() => setLimit(limit + 1)}
                        className="px-4 py-2 border border-blue-500 bg-blue-100 text-gray-600 rounded-lg hover:bg-blue-300 transition text-sm"
                    >
                        Tampilkan Lebih Banyak
                    </button>
                </div>
            )}

            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-20 right-8 p-2 backdrop-blur-xl text-white rounded-full shadow-lg hover:bg-gray-200 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
            )}
        </div>
    )
}