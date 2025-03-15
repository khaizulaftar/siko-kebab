"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "../pdf1/pdf1";
import moment from "moment-timezone";

export default function DateRangePicker() {
    const [dateRange, setDateRange] = useState({ min: "", max: "" });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Cek apakah masih sebelum jam 02:00 WIB
    const now = moment().tz("Asia/Jakarta");
    const today = now.hour() < 2 ? now.subtract(1, "day").format("YYYY-MM-DD") : now.format("YYYY-MM-DD");

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;

        setDateRange((prev) =>
            prev.min && !prev.max ? { ...prev, max: selectedDate } : { min: selectedDate, max: "" }
        );
    };

    useEffect(() => {
        if (dateRange.min && dateRange.max) {
            fetchHistory();
        }
    }, [dateRange.min, dateRange.max]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/pdf1?min=${dateRange.min}&max=${dateRange.max}`);
            setHistory(response.data);
        } catch (error) {
            Swal.fire("Error", "Gagal mengambil data history.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto min-h-screen p-4">
            <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-3xl mb-12">
                <div className="flex items-start justify-between w-full">
                    <h2 className="text-lg font-semibold teaxt-gray-600">Pilih rentang tanggal</h2>
                    <div className="flex justify-center">
                        {history.length > 0 && (
                            <PDFDownloadLink
                                document={<MyDocument data={history} startDate={dateRange.min} endDate={dateRange.max} />}
                                fileName={`Laporan_${dateRange.min}_${dateRange.max}.pdf`}
                            >
                                {({ loading }) =>
                                    loading ? 
                                    <div className="flex flex-col items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 text-blue-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                        <span className="text-gray-600 text-xs">Loading</span>
                                    </div>
                                    : 
                                    <div className="flex flex-col items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 text-blue-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                        </svg>
                                        <span className="text-gray-600 text-xs">Download</span>
                                    </div>
                                }
                            </PDFDownloadLink>
                        )}
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 w-full">
                    <input
                        type="date"
                        value={dateRange.min}
                        onChange={handleDateChange}
                        className="border rounded-lg p-2 w-full"
                        max={today} // Batasi agar tidak bisa memilih lebih dari hari ini
                    />
                    <input
                        type="date"
                        value={dateRange.max}
                        onChange={handleDateChange}
                        className="border rounded-lg p-2 w-full"
                        min={dateRange.min || today} // Tidak bisa kurang dari min
                        max={today}
                        disabled={!dateRange.min}
                    />
                </div>
            </div>
            {loading && (
                <div className="flex items-center justify-center mt-24">
                    <div role="status">
                        <svg aria-hidden="true" className="w-12 h-12 text-gray-200 animate-spin fill-blue-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
            {!loading && (
                <>
                    <h2 className="text-lg font-semibold mb-4 text-md text-gray-600">Detail history</h2>
                    <div className="grid sm:grid-cols-2 bg-white p-6 rounded-3xl gap-4 text-sm mb-20 sm:mb-6">
                        {history.map((item, index) => (
                            <div key={index} className="border-2 border-dashed p-6 rounded-3xl">
                                <div className="flex items-center gap-2 justify-between">
                                    <span>Nama:</span>
                                    <span>{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-between">
                                    <span>category:</span>
                                    <span>{item.category}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-between">
                                    <span>total item:</span>
                                    <span>{item.total_item}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-between">
                                    <span>jumlah pemasukan:</span>
                                    <span>Rp {item.jumlah_pemasukan.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}