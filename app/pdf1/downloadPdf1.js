"use client"

import { PDFDownloadLink } from "@react-pdf/renderer"
import Swal from "sweetalert2"
import axios from "axios"
import useSWR from 'swr'
import { useEffect, useState, useCallback } from "react"
import Cookies from "js-cookie"
import MyDocument from "../pdf1/pdf1"

const fetcher = url => axios.get(url).then(res => res.data)
const fetcherIncome = url => axios.get(url).then(res => res.data.data)

export default function DownloadPdf1() {
    const [user, setUser] = useState(null)
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)) // Format YYYY-MM
    const token = Cookies.get("token")

    const { data: data2 = {}, error: error2, isValidating: loading2, mutate: mutate2 } = useSWR(`/api/pdf1/incomePdf?bulan=${selectedMonth}`, fetcherIncome)
    const { data: data3 = [], error: error3, isValidating: loading3, mutate: mutate3 } = useSWR(`/api/pdf1/stockSetPdf?bulan=${selectedMonth}`, fetcher)

    useEffect(() => {
        if (token) {
            axios.get("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
                .then(response => setUser(response.data.user || {}))
                .catch(() => setUser(null))
        }
    }, [token])

    useEffect(() => {
        mutate2()
        mutate3()
    }, [selectedMonth])

    if (error2 || error3) return <div className="text-red-500">Error loading data...</div>

    const handleDownloadClick = useCallback((error) => {
        if (error) {
            Swal.fire("Gagal Mengunduh", "Terjadi kesalahan saat mengunduh PDF.", "error")
        } else {
            Swal.fire("Berhasil", "PDF berhasil diunduh.", "success")
        }
    }, [])

    const isLoading = loading2 || loading3

    return (
        <div className="p-6 rounded-3xl bg-white flex flex-col gap-3">
            <label className="font-medium text-md text-gray-700">Pilih Bulan: 1</label>
            <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-gray-50 rounded-lg border border-blue-600 px-5 py-2 text-gray-600 focus:ring focus:outline-none focus:ring-blue-300 focus:border-blue-300 focus:ring-opacity-802 w-full"
            />
            <div>
                {isLoading ? (
                    <p className="text-gray-500">Memuat data...</p>
                ) : (
                    <PDFDownloadLink
                        document={<MyDocument data2={data2} data3={data3} role={user?.role || "user"} />}
                        fileName={`siko_kebab_${selectedMonth}.pdf`}
                    >
                        {({ loading, error }) => (
                            <button
                                onClick={() => handleDownloadClick(error)}
                                disabled={loading || isLoading}
                                className={`px-4 py-2 rounded-full text-sm text-white ${loading || isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                            >
                                {loading || isLoading ? "Mengunduh..." : "Unduh PDF"}
                            </button>
                        )}
                    </PDFDownloadLink>
                )}
            </div>
        </div>
    )
}
