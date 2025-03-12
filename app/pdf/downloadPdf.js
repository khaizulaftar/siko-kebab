"use client"

import { PDFDownloadLink } from "@react-pdf/renderer"
import Swal from "sweetalert2"
import axios from "axios"
import useSWR from 'swr'
import { useEffect, useState, useCallback } from "react"
import Cookies from "js-cookie"
import MyDocument from "../pdf/pdf"

const fetcher = url => axios.get(url).then(res => res.data)
const fetcherIncome = url => axios.get(url).then(res => res.data.data)

export default function DownloadPdf() {
    const [user, setUser] = useState(null)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
    const token = Cookies.get("token")


    const { data: data1 = [], error: error1, isValidating: loading1, mutate: mutate1 } = useSWR(`/api/pdf?tanggal=${selectedDate}`, fetcher)
    const { data: data2 = {}, error: error2, isValidating: loading2, mutate: mutate2 } = useSWR(`/api/income?tanggal=${selectedDate}`, fetcherIncome)
    const { data: data3 = [], error: error3, isValidating: loading3, mutate: mutate3 } = useSWR(`/api/stockSet?tanggal=${selectedDate}`, fetcher)

    useEffect(() => {
        if (token) {
            axios.get("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
                .then(response => setUser(response.data.user || {}))
                .catch(() => setUser(null))
        }
    }, [token])

    useEffect(() => {
        mutate1()
        mutate2()
        mutate3()
    }, [selectedDate])

    const handleDownloadClick = useCallback((error) => {
        if (error) {
            Swal.fire("Gagal Mengunduh", "Terjadi kesalahan saat mengunduh PDF.", "error")
        } else {
            Swal.fire("Berhasil", "PDF berhasil diunduh.", "success")
        }
    }, [])

    const isLoading = loading1 || loading2 || loading3
    const hasError = error1 || error2 || error3

    return (
        <div className="p-6 rounded-3xl bg-white flex flex-col gap-3">
            <label className="font-medium text-md text-gray-700">Pilih Tanggal:</label>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-50 rounded-lg border border-blue-600 px-5 py-2 text-gray-600 focus:ring focus:outline-none focus:ring-blue-300 focus:border-blue-300 focus:ring-opacity-802 w-full"
            />
            <div>
                {hasError ? (
                    <p className="text-red-500">Error loading data...</p>
                ) : isLoading ? (
                    <p className="text-gray-500">Memuat data...</p>
                ) : (
                    <PDFDownloadLink
                        document={<MyDocument data1={data1} data2={data2} data3={data3} role={user?.role || "user"} />}
                        fileName={`siko_kebab_${selectedDate}.pdf`}
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
