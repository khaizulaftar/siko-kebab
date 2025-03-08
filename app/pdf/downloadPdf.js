"use client"

import { PDFDownloadLink } from "@react-pdf/renderer"
import Swal from "sweetalert2"
import axios from "axios"
import useSWR from 'swr'
import MyDocument from "../pdf/pdf"

const fetcher = url => axios.get(url).then(res => res.data)

export default function DownloadPdf() {
    const { data: data1 = [], error: error1 } = useSWR("/api/pdf", fetcher)
    const { data: data2 = {}, error: error2 } = useSWR("/api/income", fetcher)
    const { data: data3 = [], error: error3 } = useSWR("/api/stockSet", fetcher)

    const handleDownloadClick = (error) => {
        if (error) {
            Swal.fire("Gagal Mengunduh", "Terjadi kesalahan saat mengunduh PDF.", "error")
        } else {
            Swal.fire("Berhasil", "PDF berhasil diunduh.", "success")
        }
    }

    if (error1 || error2 || error3) {
        return <div>Error loading data...</div>
    }

    return (
        <PDFDownloadLink
            document={<MyDocument data1={data1} data2={data2} data3={data3} />}
            fileName="siko_kebab.pdf"
        >
            {({ loading, error }) => (
                <span
                    onClick={() => handleDownloadClick(error)}
                    disabled={loading}
                >
                    {loading ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                    )}
                </span>
            )}
        </PDFDownloadLink>
    )
}