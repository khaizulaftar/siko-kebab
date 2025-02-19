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
        <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-80 space-y-4">
                <h2 className="text-2xl font-semibold text-center">Login</h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <span className="text-gray-500">🙈</span>
                        ) : (
                            <span className="text-gray-500">👁️</span>
                        )}
                    </button>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                    Login
                </button>
            </form>
        </div>
    );
}
