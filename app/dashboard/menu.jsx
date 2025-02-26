"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Swal from "sweetalert2"

export default function Menu() {

    // menu
    const [menuKebab, setMenuKebab] = useState([])
    const [menuBurger, setMenuBurger] = useState([])
    const [menuMinuman, setMenuMinuman] = useState([])

    // set harga menu
    const [menuKebabHrg, setMenuKebabHrg] = useState("...")
    const [menuBurgerHrg, setMenuBurgerHrg] = useState("...")
    const [menuMinumanHrg, setMenuMinumanHrg] = useState("...")

    // untuk hitungan harga menu
    const [countKebab, setCountKebab] = useState(1)
    const [countBurger, setCountBurger] = useState(1)
    const [countMinuman, setCountMinuman] = useState(1)

    // pemasukan
    const totalHargaKebab = menuKebabHrg * countKebab || menuKebabHrg;
    const totalHargaBurger = menuBurgerHrg * countBurger || menuBurgerHrg;
    const totalHargaMinuman = menuMinumanHrg * countMinuman || menuMinuman;

    // untuk mengambil nama barang
    const [namakebab, setNamakebab] = useState("")
    const [namaburger, setNamaBurger] = useState("")
    const [namaminuman, setNamaMinuman] = useState("")

    const updateStock = async (nama, count) => {
        try {
            await axios.post("/api/updateStock", { menu_name: nama, count });
        } catch (error) {
            console.error("Gagal mengupdate stok!", error);
        }
    }

    const kirimKeIncome = async (totalHarga, count, category, nama, icon) => {
        const data = {
            totalHarga,
            item: count,
            category,
            nama
        };
        const data2 = {
            totalHarga,
            item: `+ ${count}`,
            category,
            nama,
            icon: icon
        };

        const confirmResult = await Swal.fire({
            title: 'Konfirmasi',
            text: `Apakah Anda yakin ingin menyimpan data ${category}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Simpan',
            cancelButtonText: 'Batal'
        });

        if (!confirmResult.isConfirmed) {
            return;
        }

        try {
            await axios.post('/api/income', data);
            await axios.post('/api/history', data2);
            await updateStock(nama, count);

            Swal.fire({
                title: 'Success',
                text: `Data ${category} berhasil disimpan!`,
                icon: 'success',
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: `Gagal mengirim data ${category}!`,
                icon: 'error',
            });
        }
    };

    const kirimKeIncomeKebab = () => kirimKeIncome(totalHargaKebab, countKebab, "kebab", namakebab, "https://img.icons8.com/emoji/50/burrito-emoji.png");
    const kirimKeIncomeBurger = () => kirimKeIncome(totalHargaBurger, countBurger, "burger", namaburger, "https://img.icons8.com/emoji/50/hamburger-emoji.png");
    const kirimKeIncomeMinuman = () => kirimKeIncome(totalHargaMinuman, countMinuman, "minuman", namaminuman, "https://img.icons8.com/emoji/50/cup-with-straw-emoji.png");


    useEffect(() => {
        axios.get("/api/menuDas/kebab")
            .then(response => setMenuKebab(response.data))

        axios.get("/api/menuDas/burger")
            .then(response => setMenuBurger(response.data))

        axios.get("/api/menuDas/minuman")
            .then(response => setMenuMinuman(response.data))
    }, [])


    return (
        <>
            <div className="mt-12 mb-24 sm:mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="capitalize font-semibold text-lg text-gray-600">menu terjual</span>
                    </div>
                    <Link className="group relative inline-flex items-center overflow-hidden bg-blue-100 rounded-full border border-blue-600 px-6 py-2.5 text-blue-600 focus:ring focus:outline-none focus:ring-blue-300 focus:ring-opacity-802"
                        href="/trafik">
                        <span className="absolute -end-full transition-all group-hover:end-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </span>
                        <span className="text-sm font-medium transition-all group-hover:me-4 capitalize"> lihat semua </span>
                    </Link>
                </div>

                <div className='grid xl:grid-cols-2 gap-6'>

                    <div className="flex flex-col align-center gap-6 p-6 border rounded-3xl shadow-sm bg-white">
                        <div className="flex items-center flex-col">
                            <div className='w-full flex items-center justify-between mb-6'>
                                <img src="https://img.icons8.com/emoji/48/burrito-emoji.png" alt="icon kebab" />
                                <span className='text-md font-semibold capitalize text-gray-600'>{namakebab}</span>
                            </div>
                            <div className='flex items-center gap-3'>
                                <span className="text-xl capitalize font-semibold">Rp{new Intl.NumberFormat('id-ID').format(Number(menuKebabHrg) * Number(countKebab) || Number(menuKebabHrg) || 0)}</span>
                                <span className='text-green-500'>+ {countKebab}</span>
                            </div>
                        </div>
                        <div>
                            <p className="capitalize mb-6">daftar menu</p>
                            <div className="flex flex-wrap">
                                {menuKebab.map((value) => (
                                    <button
                                        onClick={() => {
                                            setMenuKebabHrg(value.price)
                                            setNamakebab(value.name)
                                        }}
                                        className="px-5 py-2 tracking-wide text-gray-800 capitalize text-sm transition-colors duration-300 transform bg-white rounded-full m-1 border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80">
                                        {value.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex gap-1 items-center">
                                <button onClick={() => countKebab > 0 && setCountKebab(countKebab - 1)} className='p-2.5 border rounded-xl shadow-sm hover:bg-red-100'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                                    </svg>
                                </button>
                                <span className='flex border w-14 h-10 items-center justify-center rounded-xl shadow-sm bg-gray-100'>{countKebab}</span>
                                <button onClick={() => setCountKebab(countKebab + 1)} className='p-2.5 border rounded-xl shadow-sm hover:bg-green-100'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>
                            <button
                                onClick={kirimKeIncomeKebab}
                                class="px-6 py-2.5 text-sm border-2 border-green-600 font-medium tracking-wide text-gray-600 hover:text-white capitalize transition duration-300 transform bg-green-200 rounded-full hover:bg-green-500 hover:scale-110 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80">tambah</button>
                        </div>
                    </div>

                    <div className="flex flex-col align-center gap-6 p-6 border rounded-3xl shadow-sm bg-white">
                        <div className="flex items-center flex-col">
                            <div className='w-full flex items-center justify-between mb-6'>
                                <img src="https://img.icons8.com/emoji/48/hamburger-emoji.png" alt="icon burger" />
                                <span className='text-md font-semibold capitalize text-gray-600'>{namaburger}</span>
                            </div>
                            <div className='flex items-center gap-3'>
                                <span className="text-xl capitalize font-semibold">Rp{new Intl.NumberFormat('id-ID').format(Number(menuBurgerHrg) * Number(countBurger) || Number(menuBurgerHrg) || 0)}</span>
                                <span className='text-green-500'>+ {countBurger}</span>
                            </div>
                        </div>
                        <div>
                            <p className="capitalize mb-6">daftar menu</p>
                            <div className="flex flex-wrap">
                                {menuBurger.map((value) => (
                                    <button
                                        onClick={() => {
                                            setMenuBurgerHrg(value.price)
                                            setNamaBurger(value.name)
                                        }}
                                        class="px-5 py-2 tracking-wide text-gray-800 capitalize text-sm transition-colors duration-300 transform bg-white rounded-full m-1 border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80">
                                        {value.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-1 items-center">
                                <button onClick={() => countBurger > 0 && setCountBurger(countBurger - 1)} className='p-2.5 border rounded-xl shadow-sm hover:bg-red-100'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                                    </svg>
                                </button>
                                <span className='flex border w-14 h-10 items-center justify-center rounded-xl shadow-sm bg-gray-100'>{countBurger}</span>
                                <button onClick={() => setCountBurger(countBurger + 1)} className='p-2.5 border rounded-xl shadow-sm hover:bg-green-100'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>
                            <button
                                onClick={kirimKeIncomeBurger}
                                class="px-6 py-2.5 text-sm border-2 border-green-600 font-medium tracking-wide text-gray-600 hover:text-white capitalize transition duration-300 transform bg-green-200 rounded-full hover:bg-green-500 hover:scale-110 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80">tambah</button>
                        </div>
                    </div>

                    <div className="flex flex-col align-center gap-6 p-6 border rounded-3xl shadow-sm bg-white">
                        <div className="flex items-center flex-col">
                            <div className='w-full flex items-center justify-between mb-6'>
                                <img src="https://img.icons8.com/emoji/48/cup-with-straw-emoji.png" alt="icon minuman" />
                                <span className='text-md font-semibold capitalize text-gray-600'>{namaminuman}</span>
                            </div>
                            <div className='flex items-center gap-3'>
                                <span className="text-xl capitalize font-semibold">Rp{new Intl.NumberFormat('id-ID').format(Number(menuMinumanHrg) * Number(countMinuman) || Number(menuMinumanHrg) || 0)}</span>
                                <span className='text-green-500'>+ {countMinuman}</span>
                            </div>
                        </div>
                        <div>
                            <p className="capitalize mb-6">daftar menu</p>
                            <div className="flex flex-wrap">
                                {menuMinuman.map((value) => (
                                    <button
                                        onClick={() => {
                                            setMenuMinumanHrg(value.price)
                                            setNamaMinuman(value.name)
                                        }}
                                        class="px-5 py-2 tracking-wide text-gray-800 capitalize text-sm transition-colors duration-300 transform bg-white rounded-full m-1 border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80">
                                        {value.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-1 items-center">
                                <button onClick={() => countMinuman > 0 && setCountMinuman(countMinuman - 1)} className='p-2.5 border rounded-xl shadow-sm hover:bg-red-100'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                                    </svg>
                                </button>
                                <span className='flex border w-14 h-10 items-center justify-center rounded-xl shadow-sm bg-gray-100'>{countMinuman}</span>
                                <button onClick={() => setCountMinuman(countMinuman + 1)} className='p-2.5 border rounded-xl shadow-sm hover:bg-green-100'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>
                            <button
                                onClick={kirimKeIncomeMinuman}
                                class="px-6 py-2.5 text-sm border-2 border-green-600 font-medium tracking-wide text-gray-600 hover:text-white capitalize transition duration-300 transform bg-green-200 rounded-full hover:bg-green-500 hover:scale-110 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80">tambah</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}