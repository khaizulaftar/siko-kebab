"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Stock() {
    const [menus, setMenus] = useState([]);
    const inputRefs = useRef({});
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        axios
            .get("/api/stockSet")
            .then(({ data }) => setMenus(data))
            .catch(() => {
                Swal.fire({
                    title: "The Internet?",
                    text: "Gagal mengambil data",
                    icon: "question"
                })
            });
    }, []);

    const handlePriceChange = async (id) => {
        const newStock = inputRefs.current[id]?.value;
        const stockInt = Math.floor(Number(newStock));

        if (isNaN(stockInt) || stockInt <= 0) {
            return Swal.fire({
                icon: "error",
                title: "Harga tidak valid",
                text: "Harap masukkan harga yang valid.",
            });
        }

        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Harga akan diubah!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, ubah harga",
            cancelButtonText: "Batal",
        });

        if (!result.isConfirmed) return;

        setMenus(
            menus.map((menu) =>
                menu.id === id ? { ...menu, loading: true } : menu
            )
        );

        try {
            const response = await fetch("/api/stockSet", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, stock: stockInt }),
            });

            if (!response.ok) throw new Error();

            setMenus(
                menus.map((menu) => menu.id === id ? { ...menu, stock: stockInt, loading: false } : menu)
            )
            setEditingId(null);
        } catch {
            Swal.fire({
                icon: "error",
                title: "Gagal memperbarui harga",
                text: "Silakan coba lagi.",
            });
            setMenus(
                menus.map((menu) =>
                    menu.id === id ? { ...menu, loading: false } : menu
                )
            );
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="mt-32 mx-6">
                    <div className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                        >
                            <path fill="#f48fb1" d="M37.8,45.7l-8.7-6.3c-0.3-0.3-0.8-0.3-1.2,0l-8.7,6.3c-1.3,1-3.2,0-3.2-1.6V13c0-1.1,0.9-2,2-2h21c1.1,0,2,0.9,2,2v31.1C41,45.7,39.2,46.7,37.8,45.7z"></path>
                        </svg>
                        <span className="capitalize">stock barang</span>
                    </div>
                    <hr className="my-6" />
                    <div className="grid sm:grid-cols-2 gap-3">
                        {menus.map(({ id, name, stock, dose, initial_stock, final_stock, out_stock, loading },
                        ) => (
                            <div key={id} className="p-6 flex flex-col gap-2 border rounded-xl">
                                <span className="font-bold text-xl">{name}</span>
                                <div className="flex flex-col text-center items-center">
                                    <span className="capitalize font-bold">jumlah Stock</span>
                                    <div className="flex gap-2">
                                        <span className="font-bold text-xl">{stock}</span>
                                        <span className="text-xl">|</span>
                                        <span className="text-xl capitalize">{dose}</span>
                                    </div>
                                    {editingId === id ? (
                                        <div className="relative mt-6 w-full">
                                            <input
                                                type="number"
                                                className="block w-full p-4 text-sm border rounded-lg"
                                                placeholder="ubah harga barang"
                                                ref={(el) => (inputRefs.current[id] = el)}
                                            />
                                            <button
                                                onClick={() => handlePriceChange(id)}
                                                disabled={loading}
                                                className={`absolute end-2.5 bottom-2.5 bg-blue-700 text-white rounded-lg text-sm px-4 py-2 ${loading
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                    }`}
                                            >
                                                {loading
                                                    ? "Memperbarui..."
                                                    : "Ubah Harga"}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex w-full justify-end">
                                            <button
                                                onClick={() => setEditingId(id)}
                                                className="">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="currentColor"
                                                    className="size-6"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 mt-12">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm capitalize">stok awal</span>
                                        <div className="flex gap-2">
                                            <span>{initial_stock}</span>
                                            <span>|</span>
                                            <span>{dose}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm capitalize">jumlah masuk</span>
                                        <div className="flex gap-2">
                                            <span>{final_stock}</span>
                                            <span>|</span>
                                            <span>{dose}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm capitalize">jumlah habis</span>
                                        <div className="flex gap-2">
                                            <span>{out_stock}</span>
                                            <span>|</span>
                                            <span>{dose}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

