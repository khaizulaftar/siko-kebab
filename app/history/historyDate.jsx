"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function DateRangePicker() {
    const [dateRange, setDateRange] = useState({ min: "", max: "" });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    
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
            const response = await axios.get(`/api/pdf?min=${dateRange.min}&max=${dateRange.max}`);
            setHistory(response.data);
        } catch (error) {
            Swal.fire("Error", "Gagal mengambil data history.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto min-w-screen p-4">
            <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold">Pilih Rentang Tanggal</h2>
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={dateRange.min}
                        onChange={handleDateChange}
                        className="border rounded-lg p-2 w-48"
                    />
                    <input
                        type="date"
                        value={dateRange.max}
                        onChange={handleDateChange}
                        className="border rounded-lg p-2 w-48"
                    />
                </div>
            </div>
            {loading && (
                <div className="mt-4 text-center text-blue-500 font-bold">Loading...</div>
            )}
            {!loading && history.length > 0 && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-bold mb-4">Detail History</h2>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2">Nama</th>
                                <th className="border border-gray-300 p-2">Kategori</th>
                                <th className="border border-gray-300 p-2">Item</th>
                                <th className="border border-gray-300 p-2">Keterangan</th>
                                <th className="border border-gray-300 p-2">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, index) => (
                                <tr key={index} className="text-center border border-gray-300">
                                    <td className="border border-gray-300 p-2">{item.name}</td>
                                    <td className="border border-gray-300 p-2">{item.category}</td>
                                    <td className="border border-gray-300 p-2">{item.total_item}</td>
                                    <td className="border border-gray-300 p-2">{item.keterangan}</td>
                                    <td className="border border-gray-300 p-2">Rp {item.jumlah_pemasukan.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
