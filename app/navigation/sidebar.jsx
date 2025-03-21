import Link from "next/link"

export default function Sidebar() {
    return (
        <>
            <div className="h-screen p-3 flex-col justify-between items-center border-e bg-white hidden sm:flex sticky top-0">
                <img src="/images/siko kebab.png" alt="logo" className="w-16 mx-auto" />

                <div className="border rounded-xl flex flex-col gap-3 p-3">
                    <Link
                        href="/"
                        className="group relative flex justify-center rounded-xl border border-transparent hover:scale-110 p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>

                        <span
                            className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-700 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                        >
                            Home
                        </span>
                    </Link>

                    <Link
                        href="/history"
                        className="group relative flex justify-center rounded-xl border border-transparent hover:scale-110 p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>

                        <span
                            className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-700 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                        >
                            History
                        </span>
                    </Link>
                    <Link
                        href="/stock"
                        className="group relative flex justify-center rounded-xl border border-transparent hover:scale-110 p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                        </svg>

                        <span
                            className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-700 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                        >
                            Amount
                        </span>
                    </Link>

                    <Link
                        href="/setting"
                        className="group relative flex justify-center rounded-xl border border-transparent hover:scale-110 p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                        <span
                            className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-700 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                        >
                            Setting
                        </span>
                    </Link>

                    <Link
                        href="/profile"
                        className="group relative flex justify-center rounded-xl border border-transparent hover:scale-110 p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                        <span
                            className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-700 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                        >
                            Usser
                        </span>
                    </Link>
                </div>

                <div className="">
                </div>
            </div>
        </>
    )
}