"use client"

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/auth/login", { username, password });
            Cookies.set("token", response.data.token, { expires: 1 });
            router.push("/");
        } catch (error) {
            setError("Username atau password salah!");
        }
    };


    return (
        <>
            <div className="h-screen items-center flex px-4">
                <div className="max-w-lg mx-auto">
                    <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Get started today</h1>

                    <p className="mt-4 max-w-md text-center text-gray-500">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati sunt dolores deleniti
                        inventore quaerat mollitia?
                    </p>

                    <form onSubmit={handleLogin} className="mt-6 space-y-4 rounded-lg p-6 shadow-md">
                        <p className="text-center text-lg font-semibold text-gray-600">Sign in to your account</p>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-2 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 text-gray-600">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 text-gray-600">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>

                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-blue-500 text-white py-2.5 rounded hover:bg-blue-600 transition">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
        // <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
        //     <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-80 space-y-4">
        //         <h2 className="text-2xl font-semibold text-center">Login</h2>
        //         {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        //         <input
        //             type="text"
        //             placeholder="Username"
        //             value={username}
        //             onChange={(e) => setUsername(e.target.value)}
        //             required
        //             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        //         />
        //         <div className="relative">
        //             <input
        //                 type={showPassword ? "text" : "password"}
        //                 placeholder="Password"
        //                 value={password}
        //                 onChange={(e) => setPassword(e.target.value)}
        //                 required
        //                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        //             />
        //             <button
        //                 type="button"
        //                 className="absolute inset-y-0 right-2 flex items-center"
        //                 onClick={() => setShowPassword(!showPassword)}
        //             >
        //                 {showPassword ? (
        //                     <span className="text-gray-500">🙈</span>
        //                 ) : (
        //                     <span className="text-gray-500">👁️</span>
        //                 )}
        //             </button>
        //         </div>
        //         <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
        //             Login
        //         </button>
        //     </form>
        // </div>
    );
}
