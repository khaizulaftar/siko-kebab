"use client"

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function Setting() {
    const [menus, setMenus] = useState([]);
    const inputRefs = useRef({});

    useEffect(() => {
        axios.get("/api/menuSet")
            .then(response => setMenus(response.data))
            .catch(error => {
                console.error("Error fetching menu:", error);
                alert('Failed to fetch menus. Please try again later.');
            });
    }, []);    

    const handlePriceChange = async (id, newPrice) => {
        const priceInt = Math.floor(Number(newPrice));

        if (isNaN(priceInt) || priceInt <= 0) {
            alert('Harga tidak valid');
            return;
        }

        const isConfirmed = window.confirm("Apakah Anda yakin ingin mengubah harga?");

        if (!isConfirmed) {
            return;
        }

        setMenus((prevMenus) =>
            prevMenus.map((menu) =>
                menu.id === id ? { ...menu, loading: true } : menu
            )
        );

        try {
            const response = await fetch('/api/menu', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    price: priceInt,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setMenus((prevMenus) =>
                    prevMenus.map((menu) =>
                        menu.id === id ? { ...menu, price: priceInt, loading: false } : menu
                    )
                );
            } else {
                alert(result.message || 'Terjadi kesalahan');
                setMenus((prevMenus) =>
                    prevMenus.map((menu) =>
                        menu.id === id ? { ...menu, loading: false } : menu
                    )
                );
            }
        } catch (error) {
            console.error('Error updating price:', error);
            alert('Failed to update price. Please try again.');
            setMenus((prevMenus) =>
                prevMenus.map((menu) =>
                    menu.id === id ? { ...menu, loading: false } : menu
                )
            );
        }
    };


    return (
        <>
            <div className="max-w-4xl mx-auto">
                <div className="mt-32 mx-6">
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                            <path fill="#f48fb1" d="M37.8,45.7l-8.7-6.3c-0.3-0.3-0.8-0.3-1.2,0l-8.7,6.3c-1.3,1-3.2,0-3.2-1.6V13c0-1.1,0.9-2,2-2h21	c1.1,0,2,0.9,2,2v31.1C41,45.7,39.2,46.7,37.8,45.7z"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M27.3,36.9l-2.7-2c-0.3-0.3-0.8-0.3-1.2,0l-8.7,6.3c-1.3,1-3.2,0-3.2-1.6V22.3"></path><path fill="none" stroke="#18193f" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="3" d="M11.5,16.4v-8c0-1.1,0.9-2,2-2h21c1.1,0,2,0.9,2,2v31.1c0,1.6-1.8,2.6-3.2,1.6l-2-1.4"></path>
                        </svg>
                        <span className="capitalize">harga</span>
                    </div>
                    <hr className="my-6" />

                    <div className="my-6">
                        <div className="grid grid-1 sm:grid-cols-2 gap-3">
                            {menus.map((menu) => (
                                <div key={menu.id} className="p-6 border rounded-xl">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <img width="35" height="35" src={menu.icon} alt="hamburger" />
                                            <div className="flex flex-col">
                                                <span className="text-md capitalize font-bold">{menu.category}</span>
                                                <span className="text-sm capitalize">{menu.name}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <span className="text-md capitalize">harga</span>
                                            <div className="flex gap-2 items-center">
                                                <span className="text-md">Rp {menu.price}</span>
                                                <span className="text-md">|</span>
                                                <span className="text-sm uppercase">{menu.dose}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative mt-6">
                                        <input
                                            type="number"
                                            className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="ubah harga barang"
                                            id={`price-input-${menu.id}`}
                                            defaultValue={menu.price}
                                            ref={(el) => (inputRefs.current[menu.id] = el)}
                                        />
                                        <button
                                            onClick={() => handlePriceChange(menu.id, inputRefs.current[menu.id].value)}
                                            disabled={menu.loading}  // Disable the button for the specific item
                                            className={`text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 capitalize ${menu.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {menu.loading ? 'Memperbarui...' : 'Ubah Harga'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
