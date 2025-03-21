"use client"

import { useState, useRef, useEffect } from "react"
import useSWR from "swr"
import axios from "axios"
import Swal from "sweetalert2"
import Loading from "../dashboard/loading"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import moment from "moment-timezone"

export default function Stock() {
    const router = useRouter()
    const token = Cookies.get("token")

    const { data: menus = [], mutate: refreshMenus } = useSWR(
        "/api/stockSet",
        () => axios.get("/api/stockSet").then((res) => res.data),
        { refreshInterval: 5000 }
    )

    const { data: user } = useSWR("/api/auth/profile", () =>
        axios
            .get("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => res.data.user)
    )

    const notifiedItems = useRef(new Set())

    useEffect(() => {
        if (menus && Array.isArray(menus)) {
            const lowStockMenus = menus.filter(
                (menu) => menu.stock < 100 && !notifiedItems.current.has(menu.id)
            )

            if (lowStockMenus.length > 0) {
                const tableRows = lowStockMenus
                    .map(
                        (menu) => `
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${menu.name}</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${menu.stock}</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${menu.dose}</td>
                    </tr>
                `
                    )
                    .join("")

                const table = `
                <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                    <thead>
                        <tr>
                            <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Menu</th>
                            <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: right;">Stok</th>
                            <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Satuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            `;

                Swal.fire({
                    icon: "warning",
                    title: "Stok Menipis!",
                    html: `Beberapa menu memiliki stok kurang dari 100:<br><br>${table}<br>Segera lakukan pengisian ulang!`,
                    confirmButtonColor: "#3B82F6",
                })

                lowStockMenus.forEach((menu) => notifiedItems.current.add(menu.id))
            }
        }
    }, [menus])

    const [searchQuery, setSearchQuery] = useState("")
    const inputRefs = useRef({})

    if (!token) {
        router.push("/login")
        return <Loading />
    }

    const formatNumber = (number) => new Intl.NumberFormat("id-ID").format(number)

    const handleAddMenu = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Tambah Menu Stok Baru",
            html: `
                <div style="display: flex; flex-direction: column; gap: 10px;">
                <input id="swal-input1" class="swal2-input" placeholder="Nama Menu">
                <select id="swal-input2" class="swal2-select"">
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="pcs">pcs</option>
                </select>
                <input id="swal-input3" class="swal2-input" placeholder="Stok" type="text">
                <input id="swal-input4" class="swal2-input" placeholder="Harga" type="text">
                </div>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Tambah",
            cancelButtonText: "Batal",
            confirmButtonColor: "#3B82F6",
            cancelButtonColor: "#B12D67",
            preConfirm: () => {
                return [
                    document.getElementById("swal-input1").value,
                    document.getElementById("swal-input2").value,
                    document.getElementById("swal-input3").value.replace(/\./g, ""),
                    document.getElementById("swal-input4").value.replace(/\./g, ""),
                ]
            },
            didOpen: () => {
                const stokInput = document.getElementById("swal-input3")
                const hargaInput = document.getElementById("swal-input4")
k
                stokInput.addEventListener("input", () => {
                    let value = stokInput.value.replace(/\D/g, "")
                    stokInput.value = formatNumber(value)
                })

                hargaInput.addEventListener("input", () => {
                    let value = hargaInput.value.replace(/\D/g, "")
                    hargaInput.value = formatNumber(value)
                })
            },
        })

        if (!formValues) return

        const [name, dose, stock, price] = formValues

        if (!name || !dose || !stock || !price) {
            return Swal.fire({
                icon: "error",
                title: "Data tidak lengkap",
                text: "Harap isi semua field.",
            })
        }

        try {
            await axios.post("/api/stockSet", {
                name,
                dose,
                stock: parseInt(stock, 10),
                price: parseInt(price, 10),
            })
            await refreshMenus()

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: `Menu ${name} telah ditambahkan.`,
            })
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal menambahkan menu",
                text: error.response?.data?.message || "Silakan coba lagi.",
            })
        }
    }

    const handleDeleteStock = async (id, name) => {
        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: `Anda akan menghapus ${name} dari daftar stok!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#3B82F6",
        })

        if (!result.isConfirmed) return

        try {
            await axios.delete(`/api/stockSet`, { data: { id } })
            await refreshMenus()

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: `${name} telah dihapus dari daftar stok.`,
            })
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal menghapus stok",
                text: "Silakan coba lagi.",
            })
        }
    }

    const handleStockChange = async (id, name, currentStock, action) => {
        const inputValue = inputRefs.current[id]?.value.replace(/\./g, "")
        const changeValue = parseInt(inputValue, 10)

        if (isNaN(changeValue)) {
            return Swal.fire({
                icon: "error",
                title: "Nilai tidak valid",
                text: "Harap masukkan nilai yang valid.",
            })
        }

        const newStock =
            action === "increase" ? currentStock + changeValue : currentStock - changeValue

        if (newStock < 0) {
            return Swal.fire({
                icon: "error",
                title: "Jumlah tidak valid",
                text: "Stok tidak boleh kurang dari 0.",
            })
        }

        if (user?.role === "staf" && action === "decrease") {
            return Swal.fire({
                icon: "error",
                title: "Akses Ditolak",
                text: "Staff hanya bisa menambah stok, bukan mengurangi.",
            })
        }

        const result = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: `Stok akan di${action === "increase" ? "tambah" : "kurang"}i sebanyak ${formatNumber(changeValue)}!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Ya, ${action === "increase" ? "tambah" : "kurang"}i stok`,
            cancelButtonText: "Batal",
            confirmButtonColor: "#3B82F6",
            cancelButtonColor: "#B12D67",
        })

        if (!result.isConfirmed) return

        try {
            await axios.put("/api/stockSet", { id, stock: newStock })
            await refreshMenus()
            inputRefs.current[id].value = ""

            await axios.post("/api/history", {
                totalHarga: changeValue,
                item: null,
                keterangan: `${action === "increase" ? "ditambah" : "dikurangi"}`,
                category: "stok",
                nama: name,
                icon:
                    action === "increase"
                        ? "https://img.icons8.com/bubbles/100/plus.png"
                        : "https://img.icons8.com/bubbles/100/minus.png",
            })

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: `Stok telah di${action === "increase" ? "tambah" : "kurang"}i sebanyak ${formatNumber(changeValue)}`,
            })
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal memperbarui stok",
                text: "Silakan coba lagi.",
            })
        }
    }

    const handleEditPrice = async (id, name, currentPrice) => {
        const { value: newPrice } = await Swal.fire({
            title: `Ubah harga untuk ${name}`,
            input: "text",
            inputValue: formatNumber(currentPrice),
            inputAttributes: {
                autocapitalize: "off",
                type: "tel",
                inputmode: "numeric",
            },
            showCancelButton: true,
            confirmButtonText: "Simpan",
            cancelButtonText: "Batal",
            confirmButtonColor: "#3B82F6",
            cancelButtonColor: "#B12D67",
            didOpen: () => {
                const input = Swal.getInput()
                input.setAttribute("type", "tel")
                input.setAttribute("inputmode", "numeric")
                input.addEventListener("input", () => {
                    let rawValue = input.value.replace(/\D/g, "") 
                    input.value = formatNumber(Number(rawValue))
                })
            },
            preConfirm: (value) => value.replace(/\D/g, ""),
        })

        if (!newPrice) return

        try {
            await axios.put("/api/stockSet", { id, price: Number(newPrice) })
            await refreshMenus()

            // Simpan ke history
            await axios.post("/api/history", {
                totalHarga: newPrice,
                item: null,
                keterangan: "diubah",
                category: "harga",
                nama: name,
                icon: "https://img.icons8.com/bubbles/100/summer-sales.png",
            })

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Harga telah diperbarui.",
            })
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Gagal memperbarui harga",
                text: "Silakan coba lagi.",
            })
        }
    }

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const filteredMenus = menus.filter((menu) =>
        menu.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (!menus.length) {
        return <Loading />
    }

    return (
        <div className="max-w-4xl mx-auto min-h-screen">
            <div className="w-full pb-3 pt-6 bg-[#F4F5F7] sticky top-0 flex items-center">
                <input
                    type="text"
                    placeholder="Cari berdasarkan nama"
                    className="mx-4 placeholder-gray-400/70 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 w-full"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            {user?.role === "admin" && (
                <div className="mx-4 flex justify-end mt-1">
                    <button
                        onClick={handleAddMenu}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-100 border border-blue-500 text-sm text-blue-600 rounded-full hover:bg-blue-200 transition-all"
                    >
                        <span>Tambah stock</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 mx-4 mt-3 mb-20 sm:mb-6">
                {filteredMenus.map(
                    ({ id, name, stock, dose, initial_stock, final_stock, out_stock, price }) => (
                        <div key={id} className="p-6 flex flex-col rounded-3xl shadow-sm bg-white">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-[#B12D67] text-md mb-3">{name}</span>
                                {user?.role === "admin" && (
                                    <button onClick={() => handleDeleteStock(id, name)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 text-red-400 hover-red-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-col text-center items-center">
                                <div className="flex gap-1 items-center">
                                    <span className="font-semibold text-lg text-gray-600">
                                        {formatNumber(stock)}
                                    </span>
                                    <span className="text-lg font-semibold text-gray-600">|</span>
                                    <span className="text-lg font-semibold text-gray-600">{dose}</span>
                                </div>
                                <div className="mt-3 flex gap-4 w-full">
                                    <button
                                        onClick={() => handleStockChange(id, name, stock, "decrease")}
                                        className="flex items-center justify-center rounded-xl bg-red-100 px-4 text-sm border border-red-600 transition duration-300 hover:scale-105 focus:ring-3 focus:outline-hidden"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-4 text-gray-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                        </svg>
                                    </button>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        className="block w-full px-6 py-2.5 text-md border rounded-xl focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                                        placeholder="Masukkan nilai"
                                        ref={(el) => (inputRefs.current[id] = el)}
                                        onInput={(e) => {
                                            let value = e.target.value.replace(/\D/g, "")
                                            e.target.value = formatNumber(value)
                                        }}
                                    />
                                    <button
                                        onClick={() => handleStockChange(id, name, stock, "increase")}
                                        className="flex items-center justify-center rounded-xl bg-green-100 px-4 text-sm border border-green-600 transition duration-300 hover:scale-105 focus:ring-3 focus:outline-hidden"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-4 text-gray-600"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 4.5v15m7.5-7.5h-15"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm capitalize">stok awal</span>
                                    <div className="flex gap-1">
                                        <span className="text-sm">{formatNumber(initial_stock)}</span>
                                        <span className="text-sm">|</span>
                                        <span className="text-sm">{dose}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm capitalize">jumlah masuk</span>
                                    <div className="flex gap-1">
                                        <span className="text-sm">{formatNumber(final_stock)}</span>
                                        <span className="text-sm">|</span>
                                        <span className="text-sm">{dose}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm capitalize">jumlah habis</span>
                                    <div className="flex gap-1">
                                        <span className="text-sm">{formatNumber(out_stock)}</span>
                                        <span className="text-sm">|</span>
                                        <span className="text-sm">{dose}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm capitalize">stok akhir</span>
                                    <div className="flex gap-1">
                                        <span className="text-sm">{formatNumber(stock)}</span>
                                        <span className="text-sm">|</span>
                                        <span className="text-sm">{dose}</span>
                                    </div>
                                </div>
                            </div>
                            {user?.role === "admin" && (
                                <>
                                    <hr className="my-3 border-2 border-dashed" />
                                    <div className="flex flex-col text-center items-center">
                                        <div className="flex items-center w-full justify-between">
                                            <div className="flex items-center gap-1">
                                                <span className="text-md font-semibold text-gray-600">
                                                    Rp{formatNumber(price)}
                                                </span>
                                                <span className="text-md font-semibold text-gray-600">|</span>
                                                <span className="text-md font-semibold text-gray-600">{dose}</span>
                                            </div>
                                            <button onClick={() => handleEditPrice(id, name, price)}>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-6 text-md font-semibold text-blue-400 hover:scale-110 transition"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm capitalize">jumlah awal</span>
                                            <span className="text-green-500 text-sm">
                                                Rp{formatNumber(initial_stock * price)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm capitalize">jumlah habis</span>
                                            <span className="text-green-500 text-sm">
                                                Rp{formatNumber(out_stock * price)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between border-t-2 border-dashed pt-2">
                                            <span className="text-sm capitalize">selisih</span>
                                            <span className="text-gray-500 text-sm">
                                                Rp{formatNumber((initial_stock - out_stock) * price)}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}