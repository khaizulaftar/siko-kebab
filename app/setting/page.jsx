"use client";

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import Swal from "sweetalert2"

export default function Setting() {
    const [menus, setMenus] = useState([])
    const inputRefs = useRef({})
    const [editingId, setEditingId] = useState(null)
    const [selectedId, setSelectedId] = useState(null)

    useEffect(() => {
        axios.get("/api/menuSet")
            .then(({ data }) => setMenus(data))
            .catch(() => {
                Swal.fire({
                    title: "The Internet?",
                    text: "Gagal mengambil data",
                    icon: "question"
                })
            })
    }, [])

    const handlePriceChange = async (id) => {
        const price = Math.floor(Number(inputRefs.current[id].value));
        if (isNaN(price) || price <= 0) {
            Swal.fire({
                icon: "error",
                title: "Terjadi kesalahan",
                text: "Harga tidak valid. Pastikan harga lebih besar dari 0.",
            });
            return
        }

        setSelectedId(id)

        const result = await Swal.fire({
            title: "Apakah Anda yakin ingin mengubah harga?",
            text: "Harga akan diperbarui setelah Anda mengonfirmasi.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, ubah harga!",
            cancelButtonText: "Batal",
        });

        if (result.isConfirmed) {
            handleAlertConfirm()
        }
    };

    const handleAlertConfirm = async () => {
        const price = Math.floor(Number(inputRefs.current[selectedId].value));
        setMenus((prev) => prev.map((m) => (m.id === selectedId ? { ...m, loading: true } : m)))

        try {
            await axios.put("/api/menuSet", { id: selectedId, price })
            setMenus((prev) =>
                prev.map((m) => (m.id === selectedId ? { ...m, price, loading: false } : m))
            );
            setEditingId(null);
            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Harga telah diperbarui.",
            });
        } catch {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal memperbarui harga. Silakan coba lagi.",
            });
            setMenus((prev) => prev.map((m) => (m.id === selectedId ? { ...m, loading: false } : m)));
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto mt-32 mx-6">
                <div className="grid sm:grid-cols-2 gap-3">
                    {menus.map(({ id, icon, category, name, price, dose,bahan, loading }) => (
                        <div key={id} className="p-6 border rounded-xl">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <img width="35" height="35" src={icon} alt="hamburger" />
                                    <div className="flex flex-col">
                                        <span className="text-md font-bold capitalize">{category}</span>
                                        <span className="text-sm capitalize">{name}</span>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <span className="text-md capitalize">harga</span>
                                    <div className="flex gap-2 items-center">
                                        <span className="text-md">Rp {price}</span>
                                        <span className="text-md">|</span>
                                        <span className="text-sm uppercase">{dose}</span>                                        
                                    </div>
                                </div>
                            </div>

                            {editingId === id ? (
                                <div className="relative mt-6">
                                    <input
                                        type="number"
                                        className="block w-full p-4 text-sm border rounded-xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="ubah harga barang"
                                        defaultValue={price}
                                        ref={(el) => (inputRefs.current[id] = el)}
                                    />
                                    <button
                                        onClick={() => handlePriceChange(id)}
                                        disabled={loading}
                                        className={`absolute end-2.5 bottom-2.5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-xl text-sm px-4 py-2 capitalize ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {loading ? "Memperbarui..." : "Ubah Harga"}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex mt-3 justify-end">
                                    <button
                                        className="justify-end"
                                        onClick={() => setEditingId(id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

