"use client"

import { useEffect, useState } from "react"
import axios from 'axios'
import Swal from "sweetalert2"

export default function History() {
    const [history, setHistory] = useState([])

    useEffect(() => {
        axios.get("/api/history")
            .then(response => setHistory(response.data))
            .catch(() => Swal.fire({
                title: "The Internet?",
                text: "gagal mengambil data",
                icon: "question"
            }))
    }, [])

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="mt-32 mx-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                                <path fill="#f48fb1" d="M37.8,45.7l-8.7-6.3c-0.3-0.3-0.8-0.3-1.2,0l-8.7,6.3c-1.3,1-3.2,0-3.2-1.6V13c0-1.1,0.9-2,2-2h21	c1.1,0,2,0.9,2,2v31.1C41,45.7,39.2,46.7,37.8,45.7z"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M27.3,36.9l-2.7-2c-0.3-0.3-0.8-0.3-1.2,0l-8.7,6.3c-1.3,1-3.2,0-3.2-1.6V22.3"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M11.5,16.4v-8c0-1.1,0.9-2,2-2h21c1.1,0,2,0.9,2,2v31.1c0,1.6-1.8,2.6-3.2,1.6l-2-1.4"></path>
                            </svg>
                            <span className="capitalize">menu terjual</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="capitalize">lihat semua</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </div>
                    <hr className="my-6" />

                    <div className="my-6">
                        <p className="capitalize mb-6">06, maret, 2002</p>

                        <div className="grid grid-1 sm:grid-cols-2 gap-3">
                            {history.map((value) => (
                                <>
                                    <div key={value.id} className="p-6 border rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-md capitalize font-bold">{value.category}</span>
                                                <span className="text-sm capitalize">{value.name}</span>
                                            </div>
                                        </div>
                                        <div className="bg-orange-10">
                                            <span className="text-md font-bold">{value.jumlah_pemasukan}</span>
                                            <div className="flex items-center justify-end gap-1 mt-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 font-bold text-green-500">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                                <span className="text-md">{value.item}</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}