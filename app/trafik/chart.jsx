"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ChartIncome() {
    const [dataPemasukan, setDataPemasukan] = useState({
        total_pemasukan: []
    });

    useEffect(() => {
        axios.get("/api/trafik")
            .then(response => (setDataPemasukan(response.data.data)))
    }, [])

    const getHariColor = (hari) => {
        if (hari === "Jum") return "text-yellow-500 font-bold";
        if (hari === "Min") return "text-red-500 font-bold";
        if (hari === "Sen") return "text-green-500 font-bold";
        return "text-gray-600";
    };

    return (
        <>
            <div class="w-full p-6 bg-white shadow-sm rounded-3xl border">
                <h2 class="text-xl font-bold text-gray-800 mb-4 text-center capitalize">Traffic penghasilan</h2>
                <div class="relative h-48 border-l border-b border-gray-300 flex items-end space-x-3 pb-4 px-4">
                    <div class="absolute top-1/4 w-full border-t border-dashed border-gray-200"></div>
                    <div class="absolute top-1/2 w-full border-t border-dashed border-gray-200"></div>
                    <div class="absolute top-3/4 w-full border-t border-dashed border-gray-200"></div>


                    <div class="flex gap-6 items-end w-full">
                        {
                            dataPemasukan.total_pemasukan.map((value, index) => (
                                <div class="flex flex-col items-center justify-center relative">
                                    <span class="text-xs absolute -top-6 text-gray-600 font-semibold">{new Intl.NumberFormat('id-ID').format(Number(value) || 0)}</span>
                                    <span className="w-2 bg-blue-500 rounded-t-full transition-all duration-500 hover:bg-blue-600" style={{ height: `${value / 5000}px` }}></span>
                                    <span className={`text-sm capitalize font-semibold ${getHariColor(dataPemasukan.hari[dataPemasukan.tanggal[index]])}`}>
                                        {dataPemasukan.hari[dataPemasukan.tanggal[index]]}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

        </>
    )
}