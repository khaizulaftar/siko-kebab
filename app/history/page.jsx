"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import Loading from "../dashboard/loading"
import HistoryDate from "./historyDate"
import HistorySet from "./historySet"
import HistoryIncome from "./historyIncome"

export default function History() {
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const [activeTab, setActiveTab] = useState("set")
    const router = useRouter()

    useEffect(() => {
        const token = Cookies.get("token")
        if (!token) {
            setIsAuthenticated(false)
            router.push("/login")
            return
        }
        setIsAuthenticated(true)
    }, [router])

    if (isAuthenticated === false) return <Loading />

    return (
        <div className="flex flex-col items-center bg-gray-100 mt-6">
            <div className="flex gap-3 items-center justify-center">
                <button
                    onClick={() => setActiveTab("date")}
                    className={`px-6 py-2 text-sm rounded-lg font-medium shadow-sm transition ${activeTab === "date"
                        ? "bg-blue-400 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                    </svg>
                </button>
                <button
                    onClick={() => setActiveTab("set")}
                    className={`px-6 py-2 text-sm rounded-lg shadow-sm font-medium transition ${activeTab === "set"
                        ? "bg-blue-400 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                <button
                    onClick={() => setActiveTab("income")}
                    className={`px-6 py-2 text-sm rounded-lg font-medium shadow-sm transition ${activeTab === "income"
                        ? "bg-blue-400 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                    </svg>
                </button>
            </div>
            
            <div className="w-full">
                {activeTab === "date" ? (
                    <HistoryDate />
                ) : activeTab === "set" ? (
                    <HistorySet />
                ) : (
                    <HistoryIncome />
                )}
            </div>
        </div>
    )
}