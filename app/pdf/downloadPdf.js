// "use client"

// import { PDFDownloadLink } from "@react-pdf/renderer"
// import Swal from "sweetalert2"
// import axios from "axios"
// import useSWR from 'swr'
// import { useEffect, useState } from "react"
// import Cookies from "js-cookie"
// import MyDocument from "../pdf/pdf"

// const fetcher = url => axios.get(url).then(res => res.data)

// export default function DownloadPdf() {
//     const [user, setUser] = useState(null)
//     const token = Cookies.get("token")

//     // Fetch Data
//     const { data: data1 = [], error: error1 } = useSWR("/api/pdf", fetcher)
//     const { data: data2 = {}, error: error2 } = useSWR("/api/income", fetcher)
//     const { data: data3 = [], error: error3 } = useSWR("/api/stockSet", fetcher)

//     // Ambil data user dari API
//     useEffect(() => {
//         if (token) {
//             axios.get("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
//                 .then(response => {
//                     setUser(response.data.user || {})
//                 })
//                 .catch(() => setUser(null))
//         }
//     }, [token])

//     if (error1 || error2 || error3) return <div>Error loading data...</div>

//     const handleDownloadClick = (error) => {
//         if (error) {
//             Swal.fire("Gagal Mengunduh", "Terjadi kesalahan saat mengunduh PDF.", "error")
//         } else {
//             Swal.fire("Berhasil", "PDF berhasil diunduh.", "success")
//         }
//     }

//     return (
//         <PDFDownloadLink
//             document={<MyDocument data1={data1} data2={data2} data3={data3} role={user?.role || "user"} />}
//             fileName="siko_kebab.pdf"
//         >
//             {({ loading, error }) => (
//                 <button
//                     onClick={() => handleDownloadClick(error)}
//                     disabled={loading}
//                 >
//                     {loading ?
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 text-white">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
//                         </svg>
//                         :
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 text-white hover:text-gray-300">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
//                         </svg>
//                     }
//                 </button>
//             )}
//         </PDFDownloadLink>
//     )
// }


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

    // Fetch Data
    const { data: data1 = [], error: error1, isValidating: loading1, mutate: mutate1 } = useSWR(`/api/pdf?tanggal=${selectedDate}`, fetcher)
    const { data: data2 = {}, error: error2, isValidating: loading2, mutate: mutate2 } = useSWR(`/api/income?tanggal=${selectedDate}`, fetcherIncome)
    const { data: data3 = [], error: error3, isValidating: loading3, mutate: mutate3 } = useSWR(`/api/stockSet?tanggal=${selectedDate}`, fetcher)

    // Ambil data user dari API
    useEffect(() => {
        if (token) {
            axios.get("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
                .then(response => setUser(response.data.user || {}))
                .catch(() => setUser(null))
        }
    }, [token])

    // Memuat ulang data saat tanggal berubah
    useEffect(() => {
        mutate1()
        mutate2()
        mutate3()
    }, [selectedDate])

    // Handle error
    if (error1 || error2 || error3) return <div className="text-red-500">Error loading data...</div>

    // Handle download alert
    const handleDownloadClick = useCallback((error) => {
        if (error) {
            Swal.fire("Gagal Mengunduh", "Terjadi kesalahan saat mengunduh PDF.", "error")
        } else {
            Swal.fire("Berhasil", "PDF berhasil diunduh.", "success")
        }
    }, [])

    const isLoading = loading1 || loading2 || loading3

    return (
        <div className="p-6 rounded-3xl bg-white flex flex-col gap-3">
            <label className="font-medium text-md text-gray-700">Pilih Tanggal:</label>
            <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-50 rounded-lg border border-blue-600 px-5 py-2 text-gray-600 focus:ring focus:outline-none focus:ring-blue-300 focus:border-blue-300 focus:ring-opacity-802"
            />
            
            {isLoading ? (
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
    )
}