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


    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="mx-6 my-12">
                    <ChartIncome />
                    <div className="my-6 grid sm:grid-cols-2 gap-6">
                        <div class="p-6 bg-white shadow-sm rounded-xl border">
                            <h2 class="text-xl font-bold text-gray-800 mb-4 text-center capitalize">trafik kebab</h2>
                            <div class="relative h-48 border-l border-b border-gray-300 flex items-end space-x-3 pb-4 px-4">
                                <div class="absolute top-1/4 w-full border-t border-dashed border-gray-200"></div>
                                <div class="absolute top-1/2 w-full border-t border-dashed border-gray-200"></div>
                                <div class="absolute top-3/4 w-full border-t border-dashed border-gray-200"></div>

                                <div class="flex gap-3 items-end w-full">
                                    {
                                        dataPemasukan.total_kebab.map((value, index) => (
                                            <div class="flex flex-col items-center justify-center relative">
                                                <span class="text-sm absolute -top-6">{value}</span>
                                                <span className="w-2 bg-blue-500 rounded-t-full transition-all duration-500 hover:bg-blue-600" style={{ height: `${value}px` }}></span>
                                                <span class="text-sm capitalize text-gray-500">{dataPemasukan.hari[dataPemasukan.tanggal[index]]}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        <div class="p-6 bg-white shadow-sm rounded-xl border">
                            <h2 class="text-xl font-bold text-gray-800 mb-4 text-center capitalize">trafik burger</h2>
                            <div class="relative h-48 border-l border-b border-gray-300 flex items-end space-x-3 pb-4 px-4">
                                <div class="absolute top-1/4 w-full border-t border-dashed border-gray-200"></div>
                                <div class="absolute top-1/2 w-full border-t border-dashed border-gray-200"></div>
                                <div class="absolute top-3/4 w-full border-t border-dashed border-gray-200"></div>

                                <div class="flex gap-3 items-end w-full">
                                    {
                                        dataPemasukan.total_burger.map((value, index) => (
                                            <div class="flex flex-col items-center justify-center relative">
                                                <span class="text-sm absolute -top-6">{value}</span>
                                                <span className="w-2 bg-blue-500 rounded-t-full transition-all duration-500 hover:bg-blue-600" style={{ height: `${value}px` }}></span>
                                                <span class="text-sm capitalize text-gray-500">{dataPemasukan.hari[dataPemasukan.tanggal[index]]}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        <div class="p-6 bg-white shadow-sm rounded-xl border">
                            <h2 class="text-xl font-bold text-gray-800 mb-4 text-center capitalize">trafik minuman</h2>
                            <div class="relative h-48 border-l border-b border-gray-300 flex items-end space-x-3 pb-4 px-4">
                                <div class="absolute top-1/4 w-full border-t border-dashed border-gray-200"></div>
                                <div class="absolute top-1/2 w-full border-t border-dashed border-gray-200"></div>
                                <div class="absolute top-3/4 w-full border-t border-dashed border-gray-200"></div>

                                <div class="flex gap-3 items-end w-full">
                                    {
                                        dataPemasukan.total_minuman.map((value, index) => (
                                            <div class="flex flex-col items-center justify-center relative">
                                                <span class="text-sm absolute -top-6">{value}</span>
                                                <span className="w-2 bg-blue-500 rounded-t-full transition-all duration-500 hover:bg-blue-600" style={{ height: `${value}px` }}></span>
                                                <span class="text-sm capitalize text-gray-500">{dataPemasukan.hari[dataPemasukan.tanggal[index]]}</span>
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