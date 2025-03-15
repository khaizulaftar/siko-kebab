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
        <div className="flex flex-col items-center bg-gray-100 mt-4">
            <div className="flex gap-4">
                <button
                    onClick={() => setActiveTab("date")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                        activeTab === "date"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                >
                    History Date
                </button>
                <button
                    onClick={() => setActiveTab("set")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                        activeTab === "set"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
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
