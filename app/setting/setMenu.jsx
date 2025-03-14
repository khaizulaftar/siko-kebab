"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Loading from "../dashboard/loading"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import Swal from "sweetalert2"
import AddMenuForm from "./addMenuForm"

export default function SetMenu() {
    const [menus, setMenus] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)
    const router = useRouter()
    

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get("token")

            if (!token) {
                router.push("/login")
                return
            } else {
                setIsAuthenticated(true)
            }

            try {
                const profileRes = await axios.get("/api/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUser(profileRes.data.user || {})

                const menuRes = await axios.get("/api/menuSet")
                setMenus(menuRes.data)
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [router])

    const handleDelete = async (id) => {
        if (user?.role !== "admin") {
            Swal.fire("Akses Ditolak", "Hanya admin yang dapat menghapus menu.", "error")
            return
        }

        const confirmDelete = await Swal.fire({
            title: "Hapus Menu?",
            text: "Data menu ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal"
        })

        if (confirmDelete.isConfirmed) {
            try {
                await axios.delete("/api/menuSet", { data: { id } })
                setMenus(menus.filter(menu => menu.id !== id))
                Swal.fire("Dihapus!", "Menu telah dihapus.", "success")
            } catch (error) {
                Swal.fire("Error!", "Gagal menghapus menu.", "error")
            }
        }
    }
    const handleMenuAdded = (newMenu) => {
        setMenus([...menus, newMenu]);
    };

    if (isLoading) {
        return <Loading />
    }

    const filteredMenus = menus.filter(
        ({ name, category }) =>
            name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const icons = {
        kebab: "https://img.icons8.com/bubbles/100/burrito.png",
        burger: "https://img.icons8.com/bubbles/100/hamburger.png",
        minuman: "https://img.icons8.com/bubbles/100/iced-coffee.png",
    }
    const getCategoryIcon = (category) => icons[category.toLowerCase()] || icons.kebab

    if (!isAuthenticated) {
        return <Loading />
    }

    return (
        <div className="max-w-4xl mx-auto min-h-screen">
            <div className="w-full pb-3 pt-6 bg-[#F4F5F7] sticky top-0 flex items-center z-10">
                <input
                    type="text"
                    placeholder="Cari berdasarkan kategori, nama"
                    className="mx-4 placeholder-gray-400/70 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <AddMenuForm onMenuAdded={handleMenuAdded}/>
            <div className="grid sm:grid-cols-2 gap-4 mx-4 mt-3 mb-20 sm:mb-6">
                {filteredMenus.map(({ id, category, name, price }) => (
                    <div key={id} className="p-6 rounded-3xl bg-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={getCategoryIcon(category)} alt={category} className="w-14" />
                                <div className="flex flex-col ml-3">
                                    <span className="text-md font-semibold capitalize text-[#B12D67]">{category}</span>
                                    <span className="text-sm capitalize text-gray-600">{name}</span>
                                </div>
                            </div>
                            {user?.role === "admin" && (
                                <button
                                    onClick={() => handleDelete(id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm"
                                >
                                    Hapus
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}