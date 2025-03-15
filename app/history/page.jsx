"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Loading from "../dashboard/loading";
import HistoryDate from "./historyDate";
import HistorySet from "./historySet";

export default function History() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [activeTab, setActiveTab] = useState("set"); // "date" atau "set"
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            setIsAuthenticated(false);
            router.push("/login");
            return;
        }
        setIsAuthenticated(true);
    }, [router]);

    if (isAuthenticated === false) return <Loading />;

    return (
        <div className="flex flex-col items-center bg-gray-100 my-4">
            <div className="flex gap-4">
                <button
                    onClick={() => setActiveTab("date")}
                    className={`px-4 py-2 text-sm rounded-lg font-medium transition ${
                        activeTab === "date"
                            ? "bg-blue-500 text-white shadow-sm"
                            : "bg-white text-gray-700 hover:bg-gray-300 shadow-sm"
                    }`}
                >
                    History Date
                </button>
                <button
                    onClick={() => setActiveTab("set")}
                    className={`px-4 py-2 text-sm rounded-lg font-medium transition ${
                        activeTab === "set"
                            ? "bg-blue-500 text-white shadow-sm"
                            : "bg-white text-gray-700 hover:bg-gray-300 shadow-sm"
                    }`}
                >
                    History Set
                </button>
            </div>

            <div className="w-full">
                {activeTab === "date" ? <HistoryDate /> : <HistorySet />}
            </div>
        </div>
    );
}
