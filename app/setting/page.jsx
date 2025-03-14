"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import Loading from "../dashboard/loading"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function Setting() {
    const [menus, setMenus] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [formattedPrices, setFormattedPrices] = useState({})
    const [searchQuery, setSearchQuery] = useState("")
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const token = Cookies.get("token")
        if (!token) {
            router.push("/login")
        } else {
            setIsAuthenticated(true)
        }

        axios.get("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setUser(response.data.user || {}))


        axios.get("/api/menuSet")
            .then(({ data }) => {
                setMenus(data)
                const initialPrices = data.reduce((acc, { id, price }) => {
                    acc[id] = new Intl.NumberFormat("id-ID").format(price)
                    return acc
                }, {})
                setFormattedPrices(initialPrices)
                setIsLoading(false)
            })

    }, [router])

    if (isLoading) {
        return <Loading />
    }

    const handleInputChange = (id, e) => {
        let value = e.target.value.replace(/\D/g, "")
        setFormattedPrices((prev) => ({
            ...prev,
            [id]: new Intl.NumberFormat("id-ID").format(value),
        }))
    }

    const handlePriceChange = async (id, category, name) => {
        const price = parseInt(formattedPrices[id].replace(/\./g, ""), 10)

        if (isNaN(price) || price <= 0) {
            Swal.fire({
                icon: "error",
                title: "Terjadi kesalahan",
                text: "Harga tidak valid. Pastikan harga lebih besar dari 0.",
            })
            return
        }

        const result = await Swal.fire({
            title: "Apakah Anda yakin ingin mengubah harga?",
            text: "Harga akan diperbarui setelah Anda mengonfirmasi.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, ubah harga!",
            cancelButtonText: "Batal",
        })

        if (result.isConfirmed) {
            handleAlertConfirm(id, price, category, name)
        }
    }

    const handleAlertConfirm = async (id, price, category, name) => {
        setMenus((prev) =>
            prev.map((m) => (m.id === id ? { ...m, loading: true } : m))
        )

        try {
            await axios.put("/api/menuSet", { id, price })

            setMenus((prev) =>
                prev.map((m) => (m.id === id ? { ...m, price, loading: false } : m))
            )

            await saveHistory(price, category, name)

            setEditingId(null)

            Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Harga telah diperbarui.",
            })
        } catch {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal memperbarui harga. Silakan coba lagi.",
            })

            setMenus((prev) =>
                prev.map((m) => (m.id === id ? { ...m, loading: false } : m))
            )
        }
    }

    const saveHistory = async (totalHarga, category, name,) => {
        try {
            await axios.post("/api/history", {
                totalHarga,
                item: null,
                keterangan: `Harga ${category} ${name} diubah`,
                category,
                nama: name,
                icon: "https://img.icons8.com/bubbles/100/gear.png",
            })
        } catch (error) {

        }
    }

    const filteredMenus = menus.filter(
        ({ name, category }) =>
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleQtyChange = async (menuId, ingredient, oldQty, composition) => {
        const { value: newQty } = await Swal.fire({
            title: `Ubah jumlah ${ingredient}`,
            input: "number",
            inputValue: oldQty,
            inputAttributes: { min: "0" },
            showCancelButton: true,
            confirmButtonText: "Simpan",
            cancelButtonText: "Batal",
            inputValidator: (value) => {
                if (!value || value < 0) {
                    return "Jumlah harus lebih dari 0!"
                }
            },
        })

        if (newQty !== undefined && newQty !== oldQty) {
            try {
                // Update hanya `composition` tanpa mengubah format lainnya
                const updatedComposition = { ...composition, [ingredient]: Number(newQty) }

                await axios.put("/api/menuSet", { id: menuId, composition: updatedComposition })

                Swal.fire("Berhasil!", `Jumlah ${ingredient} diperbarui ke ${newQty}`, "success")

                // Perbarui state lokal setelah berhasil mengubah
                setMenus((prevMenus) =>
                    prevMenus.map((menu) =>
                        menu.id === menuId ? { ...menu, composition: updatedComposition } : menu
                    )
                )
            } catch (error) {
                Swal.fire("Gagal!", "Terjadi kesalahan saat memperbarui jumlah.", "error")
            }
        }
    }

    // untuk icon
    const icons = {
        kebab: "https://img.icons8.com/bubbles/100/burrito.png",
        burger: "https://img.icons8.com/bubbles/100/hamburger.png",
        minuman: "https://img.icons8.com/bubbles/100/iced-coffee.png",
    }
    const getCategoryIcon = (category) => icons[category.toLowerCase()] || icons.default


    if (!isAuthenticated) {
        return <Loading />
    }

    return (
        <>
            <div className="max-w-4xl mx-auto min-h-screen">
                <div className="w-full pb-3 pt-6 bg-[#F4F5F7] sticky top-0 flex items-center">
                    <input
                        type="text"
                        placeholder="Cari berdasarkan kategori, nama"
                        className="mx-4 placeholder-gray-400/70 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mx-4 mt-3 mb-20 sm:mb-6">
                    {filteredMenus.map(({ id, category, name, price, dose, loading, composition }) => (
                        <div key={id} className="p-6 rounded-3xl bg-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img src={getCategoryIcon(category)} alt={category} className="w-14"/>
                                    <div className="flex flex-col">
                                        <span className="text-md font-semibold capitalize text-[#B12D67]">{category}</span>
                                        <span className="text-sm capitalize text-gray-600">{name}</span>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="flex gap-1 items-center">
                                        <span className="text-lg font-semibold text-green-500">
                                            Rp{new Intl.NumberFormat("id-ID").format(Number(price) || 0)}
                                        </span>
                                        <span className="text-lg font-semibold text-gray-600">|</span>
                                        <span className="text-lg font-semibold text-green-500">{dose}</span>
                                    </div>
                                </div>
                            </div>

                            {editingId === id ? (
                                <div className="relative mt-3">
                                    <input
                                        type="text"
                                        className="block w-full px-6 py-3 text-md border rounded-xl focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                                        placeholder="Ubah harga barang"
                                        value={formattedPrices[id] || ""}
                                        onChange={(e) => handleInputChange(id, e)}
                                    />
                                    <button
                                        onClick={() => handlePriceChange(id, category, name)}
                                        disabled={loading}
                                        className={`absolute end-1.5 bottom-1.5 rounded-full bg-green-100 py-2.5 px-5 text-xs border border-green-600 transition focus:ring-3 focus:outline-hidden" ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {loading ? "Memperbarui..." : "Ubah Harga"}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {user?.role === "admin" &&
                                        <div className="flex mt-3 items-center justify-center rounded-full bg-green-100 p-2 text-sm border border-green-600 transition duration-300 hover:scale-105 focus:ring-3 focus:outline-hidden">
                                            <button
                                                className="capitalize text-gray-800"
                                                onClick={() => setEditingId(id)}
                                            >
                                                ubah harga
                                            </button>
                                        </div>
                                    }
                                </>
                            )}
                            <div className="mt-6">
                                <p className="capitalize font-semibold mb-3 text-sm text-[#B12D67]">pengurangan bahan</p>
                                {composition &&
                                    Object.entries(composition).map(([ingredient, qty]) => (
                                        <div key={ingredient} className="flex items-center justify-between border-b py-2">
                                            <span className="text-gray-600 text-sm">{ingredient}</span>
                                            <div className="flex gap-4 items-center">
                                                <span className="text-gray-600 text-sm">- {qty} </span>
                                                {
                                                    user?.role === "admin" && <button className="" onClick={() => handleQtyChange(id, ingredient, qty, composition)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 text-blue-500">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                                                        </svg>
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}