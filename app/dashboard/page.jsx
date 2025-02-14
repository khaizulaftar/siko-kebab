"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Swal from "sweetalert2"
import ChartIncome from '../trafik/chart'

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


    // untuk mengambil nama barang
    const [namakebab, setNamakebab] = useState("")
    const [namaburger, setNamaBurger] = useState("")
    const [namaminuman, setNamaMinuman] = useState("")

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


    const kirimKeIncome = async (totalHarga, count, category, nama) => {
        const data = {
            totalHarga,
            item: count,
            category,
            nama
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
            await axios.post('/api/history', data);

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

    // Pastikan variabel berikut sudah dideklarasikan sebelumnya
    const kirimKeIncomeKebab = () => kirimKeIncome(totalHargaKebab, countKebab, "kebab", namakebab);
    const kirimKeIncomeBurger = () => kirimKeIncome(totalHargaBurger, countBurger, "burger", namaburger);
    const kirimKeIncomeMinuman = () => kirimKeIncome(totalHargaMinuman, countMinuman, "minuman", namaminuman);



    return (
        <>
            <div className="max-w-5xl mx-auto">
                {/* jumlah pemasukan */}
                <div className="card bg-base-100  mx-6 border p-6 rounded-xl mt-12 bg-white shadow-sm">
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <span className="capitalize text-md">pemasukan</span>
                                <button onClick={() => setShowPemasukan(!showPemasukan)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </button>
                            </div>
                            <span className='text-sm text-gray-600'>{dataPemasukan.tanggal}</span>
                        </div>
                        {showPemasukan ? <span className="text-4xl font-bold">Rp {dataPemasukan.total_pemasukan}</span> : <span className='text-3xl font-bold'>......</span>}
                        <div>
                            <Link href="history" className="py-2.5 px-5 text-md font-semibold text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 capitalize">riwayat</Link>
                        </div>
                    </div>
                </div>

                {/* menu terjual  */}
                <div className="mt-32 mx-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="capitalize font-semibold text-lg text-gray-600">menu terjual</span>
                        </div>
                        <Link
                            href="/history"
                            className="flex items-center justify-center gap-2 px-6 py-2 transition-colors duration-300 bg-blue-600 rounded-full hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-802">
                            <span className="capitalize text-md font-semibold text-white">lihat semua</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>

                    <div className='flex flex-col sm:grid grid-cols-3 gap-6'>
                        <div className="grid grid-cols-3 sm:flex flex-col gap-3">
                            <div className="p-6 flex flex-col gap-1 text-center border rounded-xl bg-white shadow-sm">
                                <span className="capitalize text-xl">{dataPemasukan.total_kebab}</span>
                                <span className="capitalize text-sm">kebab</span>
                            </div>
                            <div className="p-6 flex flex-col gap-1 text-center border rounded-xl bg-white shadow-sm">
                                <span className="capitalize text-xl">{dataPemasukan.total_burger}</span>
                                <span className="capitalize text-sm">burger</span>
                            </div>
                            <div className="p-6 flex flex-col gap-1 text-center border rounded-xl bg-white shadow-sm">
                                <span className="capitalize text-xl">{dataPemasukan.total_minuman}</span>
                                <span className="capitalize text-sm">minuman</span>
                            </div>
                        </div>
                        <ChartIncome />
                    </div>
                </div>


                {/* jumlah bahan */}
                <div className="mt-32 mx-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="capitalize font-semibold text-lg text-gray-600">menu terjual</span>
                        </div>
                        <Link
                            href="/history"
                            className="flex items-center justify-center gap-2 px-6 py-2 transition-colors duration-300 bg-blue-600 rounded-full hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-802">
                            <span className="capitalize text-md font-semibold text-white">lihat semua</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>
                    <div className="grid grid-1 sm:grid-cols-2 gap-3">
                        {stock.slice(0, 6).map((value) => (
                            <div className="p-6 border rounded-xl flex items-center justify-between bg-white shadow-sm">
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

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="capitalize font-semibold text-lg text-gray-600">menu terjual</span>
                        </div>
                        <Link
                            href="/history"
                            className="flex items-center justify-center gap-2 px-6 py-2 transition-colors duration-300 bg-blue-600 rounded-full hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-802">
                            <span className="capitalize text-md font-semibold text-white">lihat semua</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>

                    <div className='grid xl:grid-cols-2 gap-6 mb-6'>

                        <div className="flex flex-col align-center gap-6 p-6 border rounded-xl bg-white shadow-sm">
                            <div className="flex items-center flex-col">
                                <span className="text-2xl capitalize">kebab</span>
                                <span className="text-xl capitalize">Rp {menuKebabHrg * countKebab || menuKebabHrg}</span>
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
                                            className="px-6 py-2 tracking-wide text-gray-800 capitalize text-sm transition-colors duration-300 transform bg-white rounded-full m-1 border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
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
                                    class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-full hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">tambah</button>
                            </div>
                        </div>

                        <div className="flex flex-col align-center gap-6 p-6 border rounded-xl bg-white shadow-sm">
                            <div className="flex items-center flex-col">
                                <span className="text-2xl capitalize">burger</span>
                                <span className="text-xl capitalize">Rp {menuBurgerHrg * countBurger || menuBurgerHrg}</span>
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
                                            class="px-6 py-2 tracking-wide text-gray-800 capitalize text-sm transition-colors duration-300 transform bg-white rounded-full m-1 border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
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
                                    class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-full hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">tambah</button>
                            </div>
                        </div>

                        <div className="flex flex-col align-center gap-6 p-6 border rounded-xl bg-white shadow-sm">
                            <div className="flex items-center flex-col">
                                <span className="text-2xl capitalize">minuman</span>
                                <span className="text-xl capitalize">Rp {menuMinumanHrg * countMinuman || menuMinumanHrg}</span>
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
                                            class="px-6 py-2 tracking-wide text-gray-800 capitalize text-sm transition-colors duration-300 transform bg-white rounded-full m-1 border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
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
                                    class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-full hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">tambah</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}