"use client"

import { useEffect, useState } from "react"
import axios from 'axios'
import Loading from "../dashboard/loading"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function History() {
    const [history, setHistory] = useState({})
    const [searchQuery, setSearchQuery] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = Cookies.get("token")
        if (!token) {
            setIsAuthenticated(false)
            router.push("/login")
            return
        }

        setIsAuthenticated(true)

        axios.get("/api/history")
            .then(response => {
                if (response.data) {
                    setHistory(response.data)
                }
            })
            .catch(error => console.error("Error fetching history:", error))
            .finally(() => setIsLoading(false))
    }, [router])

    if (isAuthenticated === false) return <Loading />
    if (isLoading) return <Loading />

    // Pastikan history adalah objek sebelum diproses
    const sortedHistory = Object.entries(history)
        .map(([date, items]) => [
            date, 
            items
                .sort((a, b) => b.id - a.id) // Urutkan berdasarkan ID dari terbesar ke terkecil
                .filter((item) => {
                    const searchLower = searchQuery.toLowerCase();
                    const formattedDate = new Date(item.tanggal).toLocaleDateString('id-ID', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    }).toLowerCase();

                    return (
                        item.category.toLowerCase().includes(searchLower) ||
                        item.name.toLowerCase().includes(searchLower) ||
                        formattedDate.includes(searchLower)
                    );
                })
        ])
        .filter(([_, items]) => items.length > 0)

    return (
        <div className="max-w-4xl mx-auto min-h-screen">
            <div className="w-full pb-3 pt-6 bg-[#F4F5F7] sticky top-0 flex items-center">
                <input
                    type="text"
                    placeholder="Cari berdasarkan kategori, nama, atau tanggal"
                    className="mx-4 placeholder-gray-400/70 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="mt-3 mb-20 sm:mb-6 mx-4">
                {sortedHistory.map(([date, items]) => (
                    <div key={date} className="mb-12">
                        <p className="capitalize font-semibold text-md mb-4">{date}</p>
                        <div className="grid grid-1 sm:grid-cols-2 gap-3 rounded-3xl p-6 bg-white">
                            {items.map((value) => (
                                <div key={value.id} className="flex items-center gap-1">
                                    <img src={value.icon} alt="icon" className="w-12" />
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-sm capitalize font-semibold text-gray-800">{value.category}</span>
                                                <span className="text-sm capitalize">{value.name}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-md font-semibold text-green-500">
                                                    {new Intl.NumberFormat('id-ID').format(Number(value.jumlah_pemasukan) || 0)}
                                                </span>
                                                <span className="text-xs text-gray-600">{value.item}</span>
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
    )
}
