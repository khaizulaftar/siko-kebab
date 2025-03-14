"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import Loading from "../dashboard/loading"
import SettingMenu from "./settingMenu"
import SetMenu from "./setMenu"

export default function Setting() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [activePage, setActivePage] = useState("settingMenu")
    const router = useRouter()

    useEffect(() => {
        const token = Cookies.get("token")
        if (!token) {
            router.push("/login")
        } else {
            setIsAuthenticated(true)
        }
    }, [router])

    if (!isAuthenticated) {
        return <Loading />
    }

    return (
        <div className="max-w-4xl mx-auto min-h-screen p-4">
            <div className="flex justify-center gap-4 mt-3 ">
                <button
                    onClick={() => setActivePage("setMenu")}
                    className={`px-4 py-2 rounded-full ${
                        activePage === "setMenu" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                >
                    Set Menu
                </button>
                <button
                    onClick={() => setActivePage("settingMenu")}
                    className={`px-4 py-2 rounded-full ${
                        activePage === "settingMenu" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                >
                    Setting Menu
                </button>
            </div>
            {activePage === "setMenu" ? <SetMenu /> : <SettingMenu />}
        </div>
    )
}
