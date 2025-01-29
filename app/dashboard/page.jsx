export default function Dashboard() {

    return (
        <>
            <div className="max-w-4xl mx-auto">
                {/* jumlah pemasukan */}
                <div className="card bg-base-100  mx-6 border p-8 rounded-xl mt-12">
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-3">
                            <span className="capitalize">pemasukan</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>

                        </div>
                        <span className="text-4xl font-bold"> Rp 40.000.000</span>
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
                            <span className="capitalize">lihat semua</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </div>
                    <hr className="my-6" />


                    <div className="grid grid-1 sm:grid-cols-2 gap-3">
                        <div className="p-6 border rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                                    <path fill="#ffe082" d="M37,17H27l-4.9-4.1c-0.7-0.6-1.7-0.9-2.6-0.9h-7.5C10.4,12,9,13.4,9,15.1v12v6.9v7c0,1.7,1.4,3.1,3.1,3.1h31.9	c1.7,0,3.1-1.4,3.1-3.1V20.1c0-1.7-1.4-3.1-3.1-3.1h-1.1H37z"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M5.5,29.8v6.7c0,1.7,1.3,3,3,3h31c1.7,0,3-1.3,3-3v-20c0-1.7-1.3-3-3-3h-1.1"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M32.7,13.5h-9.2l-4.9-4.1c-0.7-0.6-1.6-0.9-2.6-0.9H8.5c-1.7,0-3,1.3-3,3v11.7"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M6,16.5h12.1c0.9,0,1.8-0.3,2.6-0.9l2.3-1.9"></path>
                                </svg>
                                <div className="flex flex-col">
                                    <span className="text-md capitalize font-bold">burger</span>
                                    <span className="text-sm capitalize">daging</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-2xl font-bold">3000</span>
                            </div>
                        </div>
                        <div className="p-6 border rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                                    <path fill="#ffe082" d="M37,17H27l-4.9-4.1c-0.7-0.6-1.7-0.9-2.6-0.9h-7.5C10.4,12,9,13.4,9,15.1v12v6.9v7c0,1.7,1.4,3.1,3.1,3.1h31.9	c1.7,0,3.1-1.4,3.1-3.1V20.1c0-1.7-1.4-3.1-3.1-3.1h-1.1H37z"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M5.5,29.8v6.7c0,1.7,1.3,3,3,3h31c1.7,0,3-1.3,3-3v-20c0-1.7-1.3-3-3-3h-1.1"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M32.7,13.5h-9.2l-4.9-4.1c-0.7-0.6-1.6-0.9-2.6-0.9H8.5c-1.7,0-3,1.3-3,3v11.7"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M6,16.5h12.1c0.9,0,1.8-0.3,2.6-0.9l2.3-1.9"></path>
                                </svg>
                                <div className="flex flex-col">
                                    <span className="text-md capitalize font-bold">burger</span>
                                    <span className="text-sm capitalize">daging</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-2xl font-bold">3000</span>
                            </div>
                        </div>
                        <div className="p-6 border rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                                    <path fill="#ffe082" d="M37,17H27l-4.9-4.1c-0.7-0.6-1.7-0.9-2.6-0.9h-7.5C10.4,12,9,13.4,9,15.1v12v6.9v7c0,1.7,1.4,3.1,3.1,3.1h31.9	c1.7,0,3.1-1.4,3.1-3.1V20.1c0-1.7-1.4-3.1-3.1-3.1h-1.1H37z"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M5.5,29.8v6.7c0,1.7,1.3,3,3,3h31c1.7,0,3-1.3,3-3v-20c0-1.7-1.3-3-3-3h-1.1"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M32.7,13.5h-9.2l-4.9-4.1c-0.7-0.6-1.6-0.9-2.6-0.9H8.5c-1.7,0-3,1.3-3,3v11.7"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M6,16.5h12.1c0.9,0,1.8-0.3,2.6-0.9l2.3-1.9"></path>
                                </svg>
                                <div className="flex flex-col">
                                    <span className="text-md capitalize font-bold">burger</span>
                                    <span className="text-sm capitalize">daging</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-2xl font-bold">3000</span>
                            </div>
                        </div>
                        <div className="p-6 border rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                                    <path fill="#ffe082" d="M37,17H27l-4.9-4.1c-0.7-0.6-1.7-0.9-2.6-0.9h-7.5C10.4,12,9,13.4,9,15.1v12v6.9v7c0,1.7,1.4,3.1,3.1,3.1h31.9	c1.7,0,3.1-1.4,3.1-3.1V20.1c0-1.7-1.4-3.1-3.1-3.1h-1.1H37z"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M5.5,29.8v6.7c0,1.7,1.3,3,3,3h31c1.7,0,3-1.3,3-3v-20c0-1.7-1.3-3-3-3h-1.1"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M32.7,13.5h-9.2l-4.9-4.1c-0.7-0.6-1.6-0.9-2.6-0.9H8.5c-1.7,0-3,1.3-3,3v11.7"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M6,16.5h12.1c0.9,0,1.8-0.3,2.6-0.9l2.3-1.9"></path>
                                </svg>
                                <div className="flex flex-col">
                                    <span className="text-md capitalize font-bold">burger</span>
                                    <span className="text-sm capitalize">daging</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-2xl font-bold">3000</span>
                            </div>
                        </div>
                        <div className="p-6 border rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                                    <path fill="#ffe082" d="M37,17H27l-4.9-4.1c-0.7-0.6-1.7-0.9-2.6-0.9h-7.5C10.4,12,9,13.4,9,15.1v12v6.9v7c0,1.7,1.4,3.1,3.1,3.1h31.9	c1.7,0,3.1-1.4,3.1-3.1V20.1c0-1.7-1.4-3.1-3.1-3.1h-1.1H37z"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M5.5,29.8v6.7c0,1.7,1.3,3,3,3h31c1.7,0,3-1.3,3-3v-20c0-1.7-1.3-3-3-3h-1.1"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M32.7,13.5h-9.2l-4.9-4.1c-0.7-0.6-1.6-0.9-2.6-0.9H8.5c-1.7,0-3,1.3-3,3v11.7"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M6,16.5h12.1c0.9,0,1.8-0.3,2.6-0.9l2.3-1.9"></path>
                                </svg>
                                <div className="flex flex-col">
                                    <span className="text-md capitalize font-bold">burger</span>
                                    <span className="text-sm capitalize">daging</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-2xl font-bold">3000</span>
                            </div>
                        </div>
                        <div className="p-6 border rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                                    <path fill="#ffe082" d="M37,17H27l-4.9-4.1c-0.7-0.6-1.7-0.9-2.6-0.9h-7.5C10.4,12,9,13.4,9,15.1v12v6.9v7c0,1.7,1.4,3.1,3.1,3.1h31.9	c1.7,0,3.1-1.4,3.1-3.1V20.1c0-1.7-1.4-3.1-3.1-3.1h-1.1H37z"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M5.5,29.8v6.7c0,1.7,1.3,3,3,3h31c1.7,0,3-1.3,3-3v-20c0-1.7-1.3-3-3-3h-1.1"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M32.7,13.5h-9.2l-4.9-4.1c-0.7-0.6-1.6-0.9-2.6-0.9H8.5c-1.7,0-3,1.3-3,3v11.7"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M6,16.5h12.1c0.9,0,1.8-0.3,2.6-0.9l2.3-1.9"></path>
                                </svg>
                                <div className="flex flex-col">
                                    <span className="text-md capitalize font-bold">burger</span>
                                    <span className="text-sm capitalize">daging</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-2xl font-bold">3000</span>
                            </div>
                        </div>
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
                            <span className="text-2xl capitalize text-bold">10</span>
                        </div>
                        <div>
                            <p className="capitalize mb-6">daftar menu</p>
                            <div className="flex flex-wrap">
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">original</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">telur</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">keju</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">daging doble</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">pisang coklat keju</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">kentang goreng</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">pisang coklat</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">oreo colat</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">kebab frozen</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">pisang tiramisu</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-6 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>

                                <span className="font-bold text-md">10</span>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                                </svg>

                            </div>
                            <div type="button" class="py-2.5 px-5 me-2 bg-orange-100 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 capitalize">tambah</div>
                        </div>
                    </div>

                    <div className="flex flex-col align-center gap-6 p-6 border rounded-xl mt-6">
                        <div className="flex items-center flex-col">
                            <span className="text-3xl capatalize text-bold">Burger</span>
                            <span className="text-2xl capitalize text-bold">120</span>
                        </div>
                        <div>
                            <p className="capitalize mb-6">daftar menu</p>
                            <div className="flex flex-wrap">
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">original</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">telur</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">keju</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">daging doble</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">pisang coklat keju</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">kentang goreng</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">pisang coklat</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">oreo colat</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">kebab frozen</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">pisang tiramisu</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-6 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>

                                <span className="font-bold text-md">10</span>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                                </svg>

                            </div>
                            <div type="button" class="py-2.5 px-5 me-2 bg-orange-100 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 capitalize">tambah</div>
                        </div>
                    </div>

                    <div className="flex flex-col align-center gap-6 p-6 border rounded-xl mt-6">
                        <div className="flex items-center flex-col">
                            <span className="text-3xl capatalize text-bold">minuman</span>
                            <span className="text-2xl capitalize text-bold">29</span>
                        </div>
                        <div>
                            <p className="capitalize mb-6">daftar menu</p>
                            <div className="flex flex-wrap">
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">original</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">telur</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">keju</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">daging doble</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">pisang coklat keju</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">kentang goreng</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">pisang coklat</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">oreo colat</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">kebab frozen</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">Alternative</div>
                                <div type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 ">pisang tiramisu</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-6 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>

                                <span className="font-bold text-md">10</span>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                                </svg>

                            </div>
                            <div type="button" class="py-2.5 px-5 me-2 bg-orange-100 mb-2 text-sm font-medium text-gray-900 rounded-full border border-gray-200 capitalize">tambah</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}