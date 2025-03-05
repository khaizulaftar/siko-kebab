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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                        </svg>
                    )}
                </span>
            )}
        </PDFDownloadLink>
    )
}