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
        const data = { totalHarga, item: count, category, nama }
        const data2 = { totalHarga, item: `+ ${count}`, category, nama, icon }

        const confirmResult = await Swal.fire({
            title: 'Konfirmasi',
            text: `Apakah Anda yakin ingin menyimpan data ${category}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Simpan',
            cancelButtonText: 'Batal'
        })

        if (!confirmResult.isConfirmed) return

        try {
            await axios.post('/api/income', data)
            await axios.post('/api/history', data2)
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
    }, [])


    return (
        <div className="mt-12 mb-24 sm:mb-6">
            <div className="flex items-center justify-between mb-6">
                <span className="capitalize font-semibold text-lg text-gray-600">menu terjual</span>
                <Link className="group relative inline-flex items-center overflow-hidden bg-blue-100 rounded-full border border-blue-600 px-5 py-2 text-blue-600 focus:ring focus:outline-none focus:ring-blue-300 focus:ring-opacity-802"
                    href="/trafik">
                    <span className="absolute -end-full transition-all group-hover:end-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </span>
                    <span className="text-sm transition-all group-hover:me-4 capitalize">lihat semua</span>
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
                        icon: "https://img.icons8.com/emoji/50/burrito-emoji.png"
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
                        icon: "https://img.icons8.com/emoji/50/hamburger-emoji.png"
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
                        icon: "https://img.icons8.com/emoji/50/cup-with-straw-emoji.png"
                    }].map((item, index) => (
                        <div key={index} className="flex flex-col align-center gap-6 p-6 border rounded-3xl bg-white">
                            <div className="flex items-center flex-col">
                                <div className='w-full flex items-center justify-between mb-6'>
                                    <img src={item.icon} alt={`icon ${item.name}`} />
                                    <span className='text-md font-semibold capitalize text-gray-600'>{item.nama}</span>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <span className="text-xl capitalize font-semibold">Rp{new Intl.NumberFormat('id-ID').format(item.totalHarga)}</span>
                                    <span className='text-green-500'>+ {item.count}</span>
                                </div>
                            </div>
                            <div>
                                <p className="capitalize mb-6">daftar menu</p>
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
                                    <button onClick={() => item.count > 1 && item.setCount(item.count - 1)} className='p-2.5 border rounded-xl hover:bg-red-100'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                        </svg>
                                    </button>

                                    <span className='flex border w-14 h-10 items-center justify-center rounded-xl bg-gray-100'>{item.count}</span>

                                    <button onClick={() => item.setCount(item.count + 1)} className='p-2.5 border rounded-xl hover:bg-green-100'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </button>
                                </div>
                                <button onClick={() => kirimKeIncome(item.totalHarga, item.count, item.name, item.nama, item.icon)} className="px-5 py-2 border-2 border-green-600 bg-green-200 rounded-full hover:bg-green-400 hover:text-white">Tambah</button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}
