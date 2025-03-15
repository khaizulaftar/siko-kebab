"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import Loading from "../dashboard/loading"
import SettingMenu from "./settingMenu"

export default function Setting() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
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
        <SettingMenu />
    )
}
