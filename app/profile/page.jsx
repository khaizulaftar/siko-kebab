"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Loading from "../dashboard/loading";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [daftar, setDaftar] =useState([])
    const router = useRouter();


    useEffect(() => {
        axios.get("/api/auth/login")
            .then(response => setDaftar(response.data))


        const fetchProfile = async () => {
            try {
                const token = Cookies.get("token");
                if (!token) {
                    router.push("/login");
                    return;
                }
                const response = await axios.get("/api/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data.user);
            } catch (error) {
                router.push("/login");
            }
        };
        fetchProfile();
    }, [router]);

    if (!user) {
        return <Loading />
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="mt-4">
                <div className="border p-6 rounded-3xl shadow-sm flex flex-col items-center">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex justify-center items-center shadow-md">
                        <span className="text-3xl font-semibold text-gray-600">
                            {user.username.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h2 className="text-2xl font-semibold mt-4 text-gray-800">Hello, {user.username}!</h2>
                    <p className="mt-2 text-gray-500 text-sm">Role: <span className="font-medium">{user.role}</span></p>

                    {/* Logout Button */}
                    <button
                        className="mt-6 bg-red-500 text-white py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-red-600"
                        onClick={() => {
                            Cookies.remove("token");
                            router.push("/login");
                        }}
                    >
                        Logout
                    </button>
                </div>
                {daftar.map((value)=> (
                    <>
                    <div className="my-6 flex gap-6">
                        <span>{value.username}</span>
                        <span>{value.password}</span>
                        <span>{value.role}</span>
                    </div>
                    </>
                ))}
            </div>
        </div>
    );
}
