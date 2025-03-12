"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Swal from "sweetalert2"


export default function Menu() {

    const [menuKebab, setMenuKebab] = useState([])
    const [menuBurger, setMenuBurger] = useState([])
    const [menuMinuman, setMenuMinuman] = useState([])

    const [menuKebabHrg, setMenuKebabHrg] = useState(0)
    const [menuBurgerHrg, setMenuBurgerHrg] = useState(0)
    const [menuMinumanHrg, setMenuMinumanHrg] = useState(0)

    const [countKebab, setCountKebab] = useState(1)
    const [countBurger, setCountBurger] = useState(1)
    const [countMinuman, setCountMinuman] = useState(1)

    const totalHargaKebab = menuKebabHrg * countKebab
    const totalHargaBurger = menuBurgerHrg * countBurger
    const totalHargaMinuman = menuMinumanHrg * countMinuman

    const [namakebab, setNamakebab] = useState("")
    const [namaburger, setNamaBurger] = useState("")
    const [namaminuman, setNamaMinuman] = useState("")

    const updateStock = async (nama, count) => {
        try {
            await axios.post("/api/updateStock", { menu_name: nama, count })
        } catch (error) {
            console.error("Error updating stock:", error)
        }
    }

    const kirimKeIncome = async (totalHarga, count, category, nama, icon) => {
        if (!nama || count < 1) {
            Swal.fire({
                title: 'Peringatan',
                text: 'Silakan pilih menu dan jumlah harus lebih dari 0!',
                icon: 'warning',
            })
            return
        }
    
        const confirmResult = await Swal.fire({
            title: 'Konfirmasi',
            text: `Apakah Anda yakin ingin menambahkan ${category} ${nama} sebanyak ${count} dengan total harga Rp${new Intl.NumberFormat('id-ID').format(totalHarga)}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Simpan',
            cancelButtonText: 'Batal'
        })
    
        if (!confirmResult.isConfirmed) return
    
        try {
            const keterangan = `Penjualan ${category} - ${nama}`
            
            await axios.post('/api/income', { totalHarga, item: count, category, nama })
    
            await axios.post('/api/history', { totalHarga, item: count, keterangan, category, nama, icon })
    
            // Update stok
            await updateStock(nama, count)
    
            Swal.fire({
                title: 'Success',
                text: `Data ${category} berhasil disimpan!`,
                icon: 'success',
            })
        } catch (error) {
            console.error("Error saving income data:", error)
            Swal.fire({
                title: 'Error',
                text: `Gagal mengirim data ${category}!`,
                icon: 'error',
            })
        }
    }
    

    useEffect(() => {
        Promise.all([
            axios.get("/api/menuDas/kebab"),
            axios.get("/api/menuDas/burger"),
            axios.get("/api/menuDas/minuman")
        ])
            .then(([kebabRes, burgerRes, minumanRes]) => {
                setMenuKebab(kebabRes.data)
                setMenuBurger(burgerRes.data)
                setMenuMinuman(minumanRes.data)
            })
            .catch(error => {
                console.error("Error fetching menu data:", error)
                Swal.fire({
                    title: 'Error',
                    text: 'Gagal memuat menu, periksa koneksi Anda!',
                    icon: 'error',
                })
            })
    }, [])

    return (
        <div className="mt-12 mb-24 sm:mb-6">
            <div className="flex items-center justify-between mb-6">
                <span className="font-semibold text-lg text-gray-600">Menu terjual</span>
                <Link className="group relative inline-flex items-center overflow-hidden bg-blue-100 rounded-full border border-blue-600 px-5 py-2 text-blue-600 focus:ring focus:outline-none focus:ring-blue-300 focus:ring-opacity-802"
                    href="/trafik">
                    <span className="absolute -end-full transition-all group-hover:end-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </span>
                    <span className="text-sm transition-all group-hover:me-4">Lihat semua</span>
                </Link>
            </div>

            <div className='grid xl:grid-cols-2 gap-6'>
                {[
                    {
                        name: "kebab",
                        menu: menuKebab,
                        menuHrg: menuKebabHrg,
                        setMenuHrg: setMenuKebabHrg,
                        count: countKebab,
                        setCount: setCountKebab,
                        nama: namakebab,
                        setNama: setNamakebab,
                        totalHarga: totalHargaKebab,
                        icon: "https://img.icons8.com/bubbles/100/burrito.png"
                    }, {
                        name: "burger",
                        menu: menuBurger,
                        menuHrg: menuBurgerHrg,
                        setMenuHrg: setMenuBurgerHrg,
                        count: countBurger,
                        setCount: setCountBurger,
                        nama: namaburger,
                        setNama: setNamaBurger,
                        totalHarga: totalHargaBurger,
                        icon: "https://img.icons8.com/bubbles/100/hamburger.png"
                    }, {
                        name: "minuman",
                        menu: menuMinuman,
                        menuHrg: menuMinumanHrg,
                        setMenuHrg: setMenuMinumanHrg,
                        count: countMinuman,
                        setCount: setCountMinuman,
                        nama: namaminuman,
                        setNama: setNamaMinuman,
                        totalHarga: totalHargaMinuman,
                        icon: "https://img.icons8.com/bubbles/100/iced-coffee.png"
                    }].map((item, index) => (
                        <div key={index} className="flex flex-col align-center gap-6 p-6 rounded-3xl bg-white">
                            <div className="flex items-center flex-col">
                                <div className='w-full flex items-center justify-between'>
                                    <img src={item.icon} alt={`icon ${item.name}`} className='w-16' />
                                    <span className='text-sm font-semibold capitalize text-[#B13069]'>{item.nama}</span>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <span className="text-xl font-semibold text-green-500">Rp{new Intl.NumberFormat('id-ID').format(item.totalHarga)}</span>
                                    <span className='text-gray-600'>+ {item.count}</span>
                                </div>
                            </div>
                            <div>
                                <p className="mb-3 font-semibold text-gray-700">Daftar menu</p>
                                <div className="flex flex-wrap">
                                    {item.menu.map((value, idx) => (
                                        <button key={idx} onClick={() => {
                                            item.setMenuHrg(value.price)
                                            item.setNama(value.name)
                                        }} className="px-5 py-2 tracking-wide text-gray-800 capitalize text-sm bg-white rounded-full m-1 border border-gray-300 hover:bg-gray-200">
                                            {value.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex gap-1 items-center">
                                    <button onClick={() => item.count > 0 && item.setCount(item.count - 1)}
                                        className='p-2.5 border rounded-xl hover:bg-red-100'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                        </svg>
                                    </button>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={item.count}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '')
                                            item.setCount(value ? parseInt(value) : 0)
                                        }}
                                        className='border w-14 h-10 text-center rounded-xl bg-gray-100'
                                    />

                                    <button onClick={() => item.setCount(item.count + 1)}
                                        className='p-2.5 border rounded-xl hover:bg-green-100'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </button>
                                </div>
                                <button onClick={async () => {
                                    try {
                                        await kirimKeIncome(item.totalHarga, item.count, item.name, item.nama, item.icon)
                                        item.setMenuHrg(0)
                                        item.setCount(1)
                                        item.setNama("")
                                    } catch (error) {
                                        console.error("Gagal mengirim data:", error)
                                    }
                                }} className="px-5 py-2 border-2 border-green-600 bg-green-200 rounded-full hover:bg-green-400 text-gray-700 hover:text-white font-semibold">Tambah</button>
                                
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}
