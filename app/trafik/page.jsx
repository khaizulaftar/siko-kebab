"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from "sweetalert2"
import ChartIncome from "./chart";

export default function Trafik() {
    const [dataPemasukan, setDataPemasukan] = useState({
        total_kebab: [],
        total_burger: [],
        total_minuman: [],
    });

    useEffect(() => {
        axios.get("/api/trafik")
            .then(response => (setDataPemasukan(response.data.data)))
            .catch(() => Swal.fire({
                title: "The Internet?",
                text: "Gagal mengambil data",
                icon: "question"
            }))
    }, [])

    const getHariColor = (hari) => {
        if (hari === "Jum") return "text-yellow-500 font-bold";
        if (hari === "Min") return "text-red-500 font-bold";
        if (hari === "Sen") return "text-green-500 font-bold";
        return "text-gray-600"; // Warna default
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="mx-4 mt-6 sm:mb-6 mb-24">
                    <ChartIncome jumlahHari={14}/>
                    <div className="my-6 grid sm:grid-cols-2 gap-6">
                        <div class="p-6 bg-white shadow-sm rounded-3xl border">
                            <h2 class="text-xl font-bold text-gray-800 mb-4 text-center capitalize">trafik kebab</h2>
                            <div class="relative min-h-40 border-l border-b border-gray-300 flex items-end space-x-3 pb-4 px-4">
                                <div class="absolute top-1/4 w-full border-t border-dashed border-gray-200"></div>
                                <div class="absolute top-1/2 w-full border-t border-dashed border-gray-200"></div>
                                <div class="absolute top-3/4 w-full border-t border-dashed border-gray-200"></div>

                                <div class="flex gap-4 md:gap-6 items-end w-full flex-wrap">
                                    {
                                        dataPemasukan.total_kebab.slice(-7).map((value, index) => (
                                            <div class="flex flex-col items-center justify-center relative mt-6">
                                                <span class="text-sm absolute -top-6 font-semibold text-gray-600">{value}</span>
                                                <span className="w-2 bg-blue-500 rounded-t-full transition-all duration-500 hover:bg-blue-600" style={{ height: `${value}px` }}></span>
                                                <span className={`text-sm capitalize font-semibold ${getHariColor(dataPemasukan.hari[dataPemasukan.tanggal.slice(-7)[index]])}`}>
                                                    {dataPemasukan.hari[dataPemasukan.tanggal.slice(-7)[index]]}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        <div class="p-6 bg-white shadow-sm rounded-3xl border">
                            <h2 class="text-xl font-bold text-gray-800 mb-4 text-center capitalize">trafik burger</h2>
                            <div class="relative min-h-40 border-l border-b border-gray-300 flex items-end space-x-3 pb-4 px-4">
                                <div class="absolute top-1/4 w-full border-t border-dashed border-gray-200"></div>
                                <div class="absolute top-1/2 w-full border-t border-dashed border-gray-200"></div>
                                <div class="absolute top-3/4 w-full border-t border-dashed border-gray-200"></div>

                                <div class="flex gap-4 md:gap-6 items-end w-full flex-wrap">
                                    {
                                        dataPemasukan.total_burger.slice(-7).map((value, index) => (
                                            <div class="flex flex-col items-center justify-center relative mt-6">
                                                <span class="text-sm absolute -top-6 font-semibold text-gray-600">{value}</span>
                                                <span className="w-2 bg-blue-500 rounded-t-full transition-all duration-500 hover:bg-blue-600" style={{ height: `${value}px` }}></span>
                                                <span className={`text-sm capitalize font-semibold ${getHariColor(dataPemasukan.hari[dataPemasukan.tanggal.slice(-7)[index]])}`}>
                                                    {dataPemasukan.hari[dataPemasukan.tanggal.slice(-7)[index]]}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        <div class="p-6 bg-white shadow-sm rounded-3xl border">
                            <h2 class="text-xl font-bold text-gray-800 mb-4 text-center capitalize">trafik minuman</h2>
                            <div class="relative min-h-40 border-l border-b border-gray-300 flex items-end space-x-3 pb-4 px-4">
                                <div class="absolute top-1/4 w-full border-t border-dashed border-gray-200"></div>
                                <div class="absolute top-1/2 w-full border-t border-dashed border-gray-200"></div>
                                <div class="absolute top-3/4 w-full border-t border-dashed border-gray-200"></div>

                                <div class="flex gap-4 md:gap-6items-end w-full flex-wrap">
                                    {
                                        dataPemasukan.total_minuman.slice(-7).map((value, index) => (
                                            <div class="flex flex-col items-center justify-center relative mt-6">
                                                <span class="text-sm absolute -top-6 text-gray-600 font-semibold">{value}</span>
                                                <span className="w-2 bg-blue-500 rounded-t-full transition-all duration-500 hover:bg-blue-600" style={{ height: `${value}px` }}></span>
                                                <span className={`text-sm capitalize font-semibold ${getHariColor(dataPemasukan.hari[dataPemasukan.tanggal.slice(-7)[index]])}`}>
                                                    {dataPemasukan.hari[dataPemasukan.tanggal.slice(-7)[index]]}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}