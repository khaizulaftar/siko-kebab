import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "./navigation/navbar"
import Sidebar from "./navigation/sidebar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "siko kebab",
  description: "siko kebab siko selah bali",
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col sm:flex-row bg-[#F9F9FB]">
          {/* bottombar */}
          <Navbar />

          {/* sidebar */}
          <Sidebar />

          {/* children */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}