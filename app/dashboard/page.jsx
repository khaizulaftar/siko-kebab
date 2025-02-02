"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Swal from "sweetalert2"

export default function Dashboard() {
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

    // stock bahan
    const [stock, setStock] = useState([]);

    // lihat dan tidak lihat
    const [showPemasukan, setShowPemasukan] = useState(true);


    // pemasukan
    const totalHargaKebab = menuKebabHrg * countKebab || menuKebabHrg;
    const totalHargaBurger = menuBurgerHrg * countBurger || menuBurgerHrg;
    const totalHargaMinuman = menuMinumanHrg * countMinuman || menuMinuman;

    const [dataPemasukan, setDataPemasukan] = useState([]);

    useEffect(() => {
        axios.get("/api/menuDas/kebab")
            .then(response => setMenuKebab(response.data))
            .catch(() => Swal.fire({
                title: "The Internet?",
                text: "gagal mengambil data",
                icon: "question"
            }))

        axios.get("/api/menuDas/burger")
            .then(response => setMenuBurger(response.data))
            .catch(() => Swal.fire({
                title: "The Internet?",
                text: "gagal mengambil data",
                icon: "question"
            }))

        axios.get("/api/menuDas/minuman")
            .then(response => setMenuMinuman(response.data))
            .catch(() => Swal.fire({
                title: "The Internet?",
                text: "gagal mengambil data",
                icon: "question"
            }))

        // stock bahan
        axios.get("/api/stockSet")
            .then(response => setStock(response.data))
            .catch(() => Swal.fire({
                title: "The Internet?",
                text: "gagal mengambil data",
                icon: "question"
            }))

        // pemasukan
        axios.get('/api/income')
            .then(response => {
                setDataPemasukan(response.data.data);
            })
            .catch(error => {
                console.error("Error mengambil data pemasukan:", error);
            });
    }, [])


    const kirimKeIncomeKebab = async () => {
        const data = {
            totalHarga: totalHargaKebab,
        }
        try {
            const response = await axios.post('/api/income', data)
            Swal.fire({
                title: 'Success',
                text: 'Data berhasil disimpan!',
                icon: 'success',
            });
            console.log('Data berhasil dikirim:', response.data);
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Gagal mengirim data!',
                icon: 'error',
            });
        }
    };

    const kirimKeIncomeBurger = async () => {
        const data = {
            totalHarga: totalHargaBurger,
        }
        try {
            const response = await axios.post('/api/income', data)
            Swal.fire({
                title: 'Success',
                text: 'Data berhasil disimpan!',
                icon: 'success',
            });
            console.log('Data berhasil dikirim:', response.data);
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Gagal mengirim data!',
                icon: 'error',
            });
        }
    };

    const kirimKeIncomeMinuman = async () => {
        const data = {
            totalHarga: totalHargaMinuman,
        }
        try {
            const response = await axios.post('/api/income', data)
            Swal.fire({
                title: 'Success',
                text: 'Data berhasil disimpan!',
                icon: 'success',
            });
            console.log('Data berhasil dikirim:', response.data);
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Gagal mengirim data!',
                icon: 'error',
            });
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                {/* jumlah pemasukan */}
                <div className="card bg-base-100  mx-6 border p-8 rounded-xl mt-12">
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <span className="capitalize">pemasukan</span>
                                <button onClick={() => setShowPemasukan(!showPemasukan)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </button>
                            </div>
                            {dataPemasukan.map((value) => (
                                <>
                                    <span className='text-sm text-gray-600'>{value.tanggal}</span>
                                </>
                            ))}
                        </div>
                        {dataPemasukan.map((value, index) => (
                            <>
                            {showPemasukan ? <span className='text-gray-600 text-2xl font-bold'>Rp {value.total_pemasukan}</span> : <div className='text-gray-600 text-2xl font-bold'>Rp . . . . . .</div> }
                            </>
                            // <span key={index} className="text-4xl font-bold">
                            //     {showPemasukan ? `Rp ${value.total_pemasukan}` : <span>...</span>}
                            // </span>
                        ))}
                        <div>
                            <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 capitalize">riwayat</button>
                        </div>
                    </div>
                </div>

                {/* menu terjual  */}
                <div className="mt-32 mx-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                                <path fill="#f48fb1" d="M37.8,45.7l-8.7-6.3c-0.3-0.3-0.8-0.3-1.2,0l-8.7,6.3c-1.3,1-3.2,0-3.2-1.6V13c0-1.1,0.9-2,2-2h21	c1.1,0,2,0.9,2,2v31.1C41,45.7,39.2,46.7,37.8,45.7z"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M27.3,36.9l-2.7-2c-0.3-0.3-0.8-0.3-1.2,0l-8.7,6.3c-1.3,1-3.2,0-3.2-1.6V22.3"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M11.5,16.4v-8c0-1.1,0.9-2,2-2h21c1.1,0,2,0.9,2,2v31.1c0,1.6-1.8,2.6-3.2,1.6l-2-1.4"></path>
                            </svg>
                            <span className="capitalize">menu terjual</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="capitalize">lihat semua</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </div>
                    <hr className="my-6" />

                    <div>
                        <p className="capitalize mb-6">06, maret, 2002</p>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-6 flex flex-col gap-2 text-center border rounded-xl">
                                <span className="capitalize text-2xl">400</span>
                                <span className="capitalize">kebab</span>
                            </div>
                            <div className="p-6 flex flex-col gap-2 text-center border rounded-xl">
                                <span className="capitalize text-2xl">400</span>
                                <span className="capitalize">kebab</span>
                            </div>
                            <div className="p-6 flex flex-col gap-2 text-center border rounded-xl">
                                <span className="capitalize text-2xl">400</span>
                                <span className="capitalize">kebab</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* jumlah bahan */}
                <div className="mt-32 mx-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                                <path fill="#f48fb1" d="M37.8,45.7l-8.7-6.3c-0.3-0.3-0.8-0.3-1.2,0l-8.7,6.3c-1.3,1-3.2,0-3.2-1.6V13c0-1.1,0.9-2,2-2h21	c1.1,0,2,0.9,2,2v31.1C41,45.7,39.2,46.7,37.8,45.7z"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M27.3,36.9l-2.7-2c-0.3-0.3-0.8-0.3-1.2,0l-8.7,6.3c-1.3,1-3.2,0-3.2-1.6V22.3"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M11.5,16.4v-8c0-1.1,0.9-2,2-2h21c1.1,0,2,0.9,2,2v31.1c0,1.6-1.8,2.6-3.2,1.6l-2-1.4"></path>
                            </svg>
                            <span className="capitalize">jumlah bahan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link href="/stock">lihat semua</Link>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </div>
                    <hr className="my-6" />


                    <div className="grid grid-1 sm:grid-cols-2 gap-3">
                        {stock.slice(0, 6).map((value) => (
                            <div className="p-6 border rounded-xl flex items-center justify-between">
                                <span className="capitalize">{value.name}</span>
                                <div className='flex items-center gap-1'>
                                    <span className="font-semibold">{value.stock}</span>
                                    <span>|</span>
                                    <span className="uppercase">{value.dose}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>


                {/* menu terjual */}
                <div className="mt-32 mx-6">

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                                <path fill="#f48fb1" d="M37.8,45.7l-8.7-6.3c-0.3-0.3-0.8-0.3-1.2,0l-8.7,6.3c-1.3,1-3.2,0-3.2-1.6V13c0-1.1,0.9-2,2-2h21	c1.1,0,2,0.9,2,2v31.1C41,45.7,39.2,46.7,37.8,45.7z"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M27.3,36.9l-2.7-2c-0.3-0.3-0.8-0.3-1.2,0l-8.7,6.3c-1.3,1-3.2,0-3.2-1.6V22.3"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M11.5,16.4v-8c0-1.1,0.9-2,2-2h21c1.1,0,2,0.9,2,2v31.1c0,1.6-1.8,2.6-3.2,1.6l-2-1.4"></path>
                            </svg>
                            <span className="capitalize">menu terjual</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="capitalize">lihat semua</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </div>
                    <hr className="my-6" />
                    <div className="flex flex-col align-center gap-6 p-6 border rounded-xl">
                        <div className="flex items-center flex-col">
                            <span className="text-3xl capatalize text-bold">kebab</span>
                            <span className="text-2xl capitalize text-bold">Rp {menuKebabHrg * countKebab || menuKebabHrg}</span>
                        </div>
                        <div>
                            <p className="capitalize mb-6">daftar menu</p>
                            <div className="flex flex-wrap">
                                {menuKebab.map((value) => (
                                    <button
                                        onClick={() => { setMenuKebabHrg(value.price) }}
                                        class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">
                                        {value.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-6 items-center">
                                <button onClick={() => countKebab > 0 && setCountKebab(countKebab - 1)}>-</button>
                                <span>{countKebab}</span>
                                <button onClick={() => setCountKebab(countKebab + 1)}>+</button>
                            </div>
                            <button
                                onClick={kirimKeIncomeKebab}
                                class="py-2.5 px-5 me-2 bg-orange-100 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 capitalize">tambah</button>
                        </div>
                    </div>

                    <div className="flex flex-col align-center gap-6 p-6 border rounded-xl mt-6">
                        <div className="flex items-center flex-col">
                            <span className="text-3xl capatalize text-bold">Burger</span>
                            <span className="text-2xl capitalize text-bold">Rp {menuBurgerHrg * countBurger || menuBurgerHrg}</span>
                        </div>
                        <div>
                            <p className="capitalize mb-6">daftar menu</p>
                            <div className="flex flex-wrap">
                                {menuBurger.map((value) => (
                                    <button
                                        onClick={() => { setMenuBurgerHrg(value.price) }}
                                        class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">
                                        {value.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-6 items-center">
                                <button onClick={() => countBurger > 0 && setCountBurger(countBurger - 1)}>-</button>
                                <span>{countBurger}</span>
                                <button onClick={() => setCountBurger(countBurger + 1)}>+</button>
                            </div>
                            <button
                                onClick={kirimKeIncomeBurger}
                                class="py-2.5 px-5 me-2 bg-orange-100 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 capitalize">tambah</button>
                        </div>
                    </div>

                    <div className="flex flex-col align-center gap-6 p-6 border rounded-xl mt-6">
                        <div className="flex items-center flex-col">
                            <span className="text-3xl capatalize text-bold">minuman</span>
                            <span className="text-2xl capitalize text-bold">Rp {menuMinumanHrg * countMinuman || menuMinumanHrg}</span>
                        </div>
                        <div>
                            <p className="capitalize mb-6">daftar menu</p>
                            <div className="flex flex-wrap">
                                {menuMinuman.map((value) => (
                                    <button
                                        onClick={() => { setMenuMinumanHrg(value.price) }}
                                        class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">
                                        {value.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-6 items-center">
                                <button onClick={() => countMinuman > 0 && setCountMinuman(countMinuman - 1)}>-</button>
                                <span>{countMinuman}</span>
                                <button onClick={() => setCountMinuman(countMinuman + 1)}>+</button>
                            </div>
                            <button
                                onClick={kirimKeIncomeMinuman}
                                class="py-2.5 px-5 me-2 bg-orange-100 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 capitalize">tambah</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}