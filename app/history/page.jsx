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
                <div className="m-6">
                    {Object.entries(history).map(([date, items]) => (
                        <div key={date} className="mb-12">
                            <p className="capitalize font-semibold text-md mb-4">{date}</p>
                            <div className="grid grid-1 sm:grid-cols-2 gap-3 border rounded-xl p-6 shadow-sm">
                                {items.map((value) => (
                                    <div key={value.id} className="flex  items-center gap-2">
                                        <div className="p-2 rounded-full flex items-center bg-cyan-300">
                                            <img src={value.icon} alt="icon" className="w-6" />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <div className="flex flex-col">
                                                        <span className="text-md capitalize font-semibold">{value.category}</span>
                                                        <span className="text-sm capitalize">{value.name}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-md font-semibold text-green-500">{new Intl.NumberFormat('id-ID').format(Number(value.jumlah_pemasukan) || 0)}</span>
                                                    <div className="flex items-center justify-end gap-1">
                                                        <span className="text-md">{value.item}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}