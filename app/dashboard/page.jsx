"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Swal from "sweetalert2"
import ChartIncome from '../trafik/chart'
import Menu from './menu'
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Loading from './loading'
import DownloadPdf from '../pdf/downloadPdf'

export default function Dashboard() {

    const [stock, setStock] = useState([]);
    const [showPemasukan, setShowPemasukan] = useState(true);
    const [dataPemasukan, setDataPemasukan] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();


    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            router.push("/login");
        } else {
            setIsAuthenticated(true);
        }

        axios.get("/api/stockSet")
            .then(response => setStock(response.data))

        // pemasukan
        axios.get('/api/income')
            .then(response => setDataPemasukan(response.data.data))
    }, [router])


    if (!isAuthenticated) {
        return <Loading />
    }


    return (
        <>
            <div className="max-w-5xl mx-auto px-4">
                {/* jumlah pemasukan */}

                <div className="card border p-6 rounded-3xl my-6 shadow-sm bg-[url('/images/stacked-waves-haikei.svg')] bg-cover bg-center">
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <span className="capitalize text-md text-white">pemasukan</span>
                                <button onClick={() => setShowPemasukan(!showPemasukan)}>
                                    {showPemasukan ?
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 text-white">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 text-white">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    }
                                </button>
                            </div>
                            <span className='text-sm text-gray-100'>{dataPemasukan.tanggal}</span>
                        </div>
                        {showPemasukan ? <span className="text-4xl font-bold text-white">Rp{new Intl.NumberFormat('id-ID').format(Number(dataPemasukan?.total_pemasukan) || 0)}</span> : <span className='text-3xl font-bold text-white'>. . . . . .</span>}
                        <div className='flex items-center justify-between'>
                            <Link href="history" className="py-2 px-6 text-md font-semibold transition-colors duration-300 text-gray-200 focus:outline-none rounded-full border-2 border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 capitalize">riwayat</Link>
                            <DownloadPdf />
                        </div>
                    </div>
                </div>

                {/* menu terjual  */}
                <div div className="my-12">
                    <div className='flex flex-col sm:grid grid-cols-3 gap-6'>
                        <div className="grid grid-cols-3 sm:flex flex-col gap-3">
                            <div className="p-4 sm:p-6 flex flex-col gap-1 text-center border rounded-3xl shadow-sm bg-[url('/images/blurry-gradient-haikei.svg')] bg-cover bg-center">
                                <span className="capitalize text-xl text-white font-semibold">{dataPemasukan.total_kebab}</span>
                                <span className="capitalize text-sm text-white font-semibold">kebab</span>
                            </div>
                            <div className="p-4 sm:p-6 flex flex-col gap-1 text-center border rounded-3xl shadow-sm bg-[url('/images/blurry-gradient-haikei1.svg')] bg-cover bg-center">
                                <span className="capitalize text-xl text-white font-semibold">{dataPemasukan.total_burger}</span>
                                <span className="capitalize text-sm text-white font-semibold">burger</span>
                            </div>
                            <div className="p-4 sm:p-6 flex flex-col gap-1 text-center border rounded-3xl shadow-sm bg-[url('/images/blurry-gradient-haikei2.svg')] bg-cover bg-center">
                                <span className="capitalize text-xl text-white font-semibold">{dataPemasukan.total_minuman}</span>
                                <span className="capitalize text-sm text-white font-semibold">minuman</span>
                            </div>
                        </div>
                        <div className='col-span-2'>
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
                            <ChartIncome jumlahHari={14} />
                        </div>
                    </div>
                </div>

                {/* jumlah bahan */}
                <div className="my-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="capitalize font-semibold text-lg text-gray-600">jumlah bahan</span>
                        </div>
                        <Link className="group relative inline-flex items-center overflow-hidden bg-blue-100 rounded-full border border-blue-600 px-6 py-2.5 text-blue-600 focus:ring focus:outline-none focus:ring-blue-300 focus:ring-opacity-802"
                            href="/stock">
                            <span className="absolute -end-full transition-all group-hover:end-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </span>
                            <span className="text-sm font-medium transition-all group-hover:me-4 capitalize"> lihat semua </span>
                        </Link>
                    </div>
                    <div className="grid grid-1 sm:grid-cols-2 gap-3">
                        {stock.slice(0, 4).map((value) => (
                            <div className="p-6 border rounded-3xl flex items-center justify-between bg-white shadow-sm">
                                <span className="capitalize font-semibold text-gray-600 text-md">{value.name}</span>
                                <div className='flex items-center gap-1'>
                                    <span className="font-semibold text-md text-gray-600">{value.stock}</span>
                                    <span className='text-md font-semibold text-gray-600'>|</span>
                                    <span className="capitalize text-md text-gray-600">{value.dose}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
                {/* menu */}
                <Menu />
            </div>
        </>
    )
}