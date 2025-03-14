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
    const [selectedDate, setSelectedDate] = useState(null)
    const token = Cookies.get("token")

    const { data: data1 = [], error: error1, isValidating: loading1, mutate: mutate1 } = useSWR(selectedDate ? `/api/pdf?tanggal=${selectedDate}` : null, fetcher)
    const { data: data2 = {}, error: error2, isValidating: loading2, mutate: mutate2 } = useSWR(selectedDate ? `/api/income?tanggal=${selectedDate}` : null, fetcherIncome)
    const { data: data3 = [], error: error3, isValidating: loading3, mutate: mutate3 } = useSWR(selectedDate ? `/api/stockSet?tanggal=${selectedDate}` : null, fetcher)

    useEffect(() => {
        if (token) {
            axios.get("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
                .then(response => setUser(response.data.user || {}))
                .catch(() => setUser(null))
        }
    }, [token])

    useEffect(() => {
        if (selectedDate) {
            mutate1()
            mutate2()
            mutate3()
        }
    }, [selectedDate])

    const handleDownloadClick = useCallback(() => {
        Swal.fire("Berhasil", "PDF berhasil diunduh.", "success").then(() => {
            setSelectedDate(null)
        })
    }, [])

    const handleOpenModal = () => {
        Swal.fire({
            title: "Pilih Tanggal",
            input: "date",
            inputAttributes: {
                min: "2024-01-01",
                max: "2099-12-31"
            },
            showCancelButton: true,
            confirmButtonText: "Pilih tanggal",
            preConfirm: (value) => {
                if (!value) {
                    Swal.showValidationMessage("Tanggal harus dipilih")
                }
                return value
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setSelectedDate(result.value)
            }
        })
    }

    const isLoading = loading1 || loading2 || loading3
    const hasError = error1 || error2 || error3

    return (
        <div className="flex flex-col items-center">
            <button onClick={handleOpenModal} className="flex flex-col items-center hover:scale-110 transition">
                <span className='-mb-2 px-1 text-xs rounded-full bg-white text-gray-600 z-10'>Download</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 text-white p-2 rounded-full bg-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            </button>
            {selectedDate && (
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
                            {({ loading }) => (
                                <button
                                    onClick={handleDownloadClick}
                                    disabled={loading || isLoading}
                                    className={`px-2 py-1 mt-2 rounded-full text-xs text-white ${loading || isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                                >
                                    {loading || isLoading ? "Mengunduh..." : "Unduh PDF"}
                                </button>
                            )}
                        </PDFDownloadLink>
                    )}
                </div>
            )}
        </div>
    )
}