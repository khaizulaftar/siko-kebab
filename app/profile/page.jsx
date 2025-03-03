"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import Loading from "../dashboard/loading"

export default function Profile() {
    const [user, setUser] = useState(null)
    const [daftar, setDaftar] = useState([])
    const router = useRouter()

    useEffect(() => {
        axios.get("/api/auth/login")
            .then(response => setDaftar(response.data))

        const token = Cookies.get("token")
        if (!token) {
            router.push("/login")
            return
        }

        axios.get("/api/auth/profile", { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setUser(response.data.user || {}))

    }, [router])

    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        })

        if (!confirmDelete.isConfirmed) return

        try {
            const response = await axios.delete("/api/auth/profile", {
                data: { id },
            })

            Swal.fire("Berhasil!", response.data.message, "success")
            setDaftar(daftar.filter(user => user.id !== id))
        } catch (error) {
            Swal.fire("Gagal!", error.response?.data?.message || "Terjadi kesalahan", "error")
        }
    }

    const handleAddUser = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Tambah User Baru",
            html: `
                <input id="swal-username" class="swal2-input" placeholder="Username">
                <input id="swal-password" type="password" class="swal2-input" placeholder="Password">
                <select id="swal-role" class="swal2-input">
                    <option value="admin">Admin</option>
                    <option value="staf">staf</option>
                </select>
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    username: document.getElementById("swal-username").value,
                    password: document.getElementById("swal-password").value,
                    role: document.getElementById("swal-role").value,
                }
            },
        })

        if (!formValues) return

        try {
            const response = await fetch("/api/auth/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues),
            })

            const result = await response.json()

            if (response.ok) {
                Swal.fire("Berhasil!", result.message, "success")
                setDaftar([...daftar, { id: result.id, ...formValues }])
            } else {
                Swal.fire("Gagal!", result.message, "error")
            }
        } catch (error) {
            Swal.fire("Gagal!", "Terjadi kesalahan pada server", "error")
        }
    }

    const handleUpdateProfile = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Edit Profil",
            html: `
                <input id="swal-username" class="swal2-input" placeholder="Username" value="${user.username}">
                <input id="swal-password" type="password" class="swal2-input" placeholder="Password">
            `,
            focusConfirm: false,
            preConfirm: () => {
                const username = document.getElementById("swal-username").value.trim()
                const password = document.getElementById("swal-password").value.trim()

                if (!username) {
                    Swal.showValidationMessage("Username tidak boleh kosong!")
                    return false
                }

                if (!password) {
                    Swal.showValidationMessage("Password tidak boleh kosong!")
                    return false
                }

                return { username, password }
            },
        })

        if (!formValues) return

        try {
            const token = Cookies.get("token")
            const response = await axios.put("/api/auth/profile", formValues, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (response.status === 200) {
                Swal.fire("Berhasil!", response.data.message, "success")

                // Perbarui token jika username berubah
                if (response.data.token) {
                    Cookies.set("token", response.data.token, { expires: 1 }) // Simpan token baru
                }

                setUser((prev) => ({ ...prev, ...formValues }))
            } else {
                Swal.fire("Gagal!", response.data.message, "error")
            }
        } catch (error) {
            Swal.fire("Gagal!", "Terjadi kesalahan pada server", "error")
        }
    }



    if (!user) {
        return <Loading />
    }

    return (
        <div className="p-4 max-w-4xl mx-auto min-h-screen">
            <div className="mt-4 sm:grid grid-cols-2 gap-6">
                <div>
                    <div className="border p-6 bg-white rounded-3xl shadow-sm flex flex-col items-center">
                        {/* Avatar */}
                        <img
                            src={user.role === "admin"
                                ? "https://img.icons8.com/ios/80/administrator-male--v1.png"
                                : "https://img.icons8.com/ios/80/commercial-development-management.png"}
                            alt={user.role}
                        />
                        <h2 className="text-xl font-semibold text-gray-600 capitalize text">{user.username}</h2>
                        <div className="w-full mt-6 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 text-sm">Role:</span>
                                <span className="text-gray-600 text-sm">{user.role}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 text-sm">password:</span>
                                <span className="text-gray-600 text-sm">{user.password}</span>
                            </div>
                        </div>
                        <button onClick={handleUpdateProfile} className="mt-6 capitalize text-green-600">ubah profile</button>
                    </div>
                </div>
                <div className="mt-12 sm:mt-0">
                    <div className="flex items-center justify-between">
                        <span className="capitalize font-semibold text-gray-600 text-lg">nama nama staf</span>
                        {user?.role === "admin" &&
                            <button onClick={handleAddUser}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 text-green-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                </svg>
                            </button>}
                    </div>
                    {daftar.map((value, index) => (
                        <div key={index} className="flex gap-3 items-center mt-3 border rounded-3xl p-6 shadow-sm bg-white">
                            <div className="border p-2 rounded-full bg-gray-200">
                                <img
                                    src={value.role === "admin"
                                        ? "https://img.icons8.com/ios/30/administrator-male--v1.png"
                                        : "https://img.icons8.com/ios/30/commercial-development-management.png"}
                                    alt={value.role}
                                />
                            </div>
                            <div className="flex justify-between w-full">
                                <div className="flex flex-col items-star gap-1">
                                    <span className="font-semibold text-gray-600">{value.username}</span>
                                    <span className="text-sm text-gray-600">{value.password}</span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="font-semibold text-gray-600">{value.role}</span>
                                    {user?.role === "admin" &&
                                        <button onClick={() => handleDelete(value.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 text-red-600">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
            <div className="mt-16 sm:mb-0 mb-20 flex justify-center max-w-md mx-auto">
                <button
                    className="w-full bg-red-100 border-2 border-red-600 text-lg font-semibold text-red-600 hover:text-white py-2.5 px-6 rounded-full shadow-md transition hover:bg-red-600"
                    onClick={() => {
                        Cookies.remove("token")
                        router.push("/login")
                    }}
                >
                    Keluar
                </button>
            </div>
        </div >
    )
}