'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export function FloatingActionButton() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Only show after initial mount to avoid hydration issues
        setIsVisible(true)
    }, [])

    if (!isVisible) return null

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 group">
            {/* Tooltip-like labels on hover */}
            <div className="flex flex-col items-end gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md text-neutral-800 dark:text-neutral-200 px-4 py-2 rounded-xl shadow-2xl border border-white/20 dark:border-neutral-700/50 text-sm font-bold whitespace-nowrap shadow-indigo-500/10">
                    📄 Quản lý tài liệu động
                </div>
            </div>

            {/* Main FAB */}
            <Link
                href="/dynamic"
                className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 text-white shadow-2xl shadow-indigo-500/50 transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95 group-hover:shadow-indigo-500/70"
                title="Tài Liệu Động"
            >
                {/* Pulse Ring */}
                <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20 group-hover:hidden"></span>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                </svg>
            </Link>

            <style jsx>{`
                @keyframes spin-slow {
                    to { transform: rotate(360deg); }
                }
                .group:hover Link svg {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </div>
    )
}
