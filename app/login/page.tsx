'use client'

import { useActionState } from 'react'
import { login } from './actions'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'

const initialState = {
    error: '',
}

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState)
    const [showPassword, setShowPassword] = useState(false)

    // Hide Nextra layout chrome (navbar, sidebar, footer, breadcrumb, ToC etc.)
    useEffect(() => {
        document.body.classList.add('login-page')
        return () => {
            document.body.classList.remove('login-page')
        }
    }, [])

    return (
        <>
            {/* Global style to hide Nextra chrome */}
            <style>{`
                body.login-page nav,
                body.login-page footer,
                body.login-page aside,
                body.login-page .nextra-sidebar-container,
                body.login-page .nextra-breadcrumb,
                body.login-page .nextra-toc {
                    display: none !important;
                }
                body.login-page main {
                    margin: 0 !important;
                    padding: 0 !important;
                    max-width: 100% !important;
                    width: 100% !important;
                }
                body.login-page article {
                    padding: 0 !important;
                    max-width: 100% !important;
                }
                body.login-page .x\\:nextra-body,
                body.login-page [class*="nextra"] {
                    max-width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
            `}</style>

            <div className="flex min-h-screen" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                {/* Left side — animated visual */}
                <div
                    className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                    }}
                >
                    {/* Animated gradient blobs */}
                    <div
                        className="absolute w-[400px] h-[400px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
                            animation: 'drift1 20s ease-in-out infinite',
                            top: '10%',
                            left: '10%',
                        }}
                    />
                    <div
                        className="absolute w-[350px] h-[350px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
                            animation: 'drift2 25s ease-in-out infinite',
                            bottom: '10%',
                            right: '5%',
                        }}
                    />
                    <div
                        className="absolute w-[250px] h-[250px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
                            animation: 'drift3 18s ease-in-out infinite',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />

                    {/* Grid pattern overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                            backgroundSize: '60px 60px',
                        }}
                    />

                    {/* Content */}
                    <div className="relative z-10 text-center px-16 max-w-lg">
                        <div className="mb-8">
                            <img
                                src="/images/general/logo.png"
                                alt="O24 Logo"
                                className="mx-auto h-16 mb-8 opacity-90"
                            />
                        </div>
                        <h2
                            className="text-white text-3xl font-bold mb-4 tracking-tight"
                            style={{ fontFamily: "'Quicksand', sans-serif" }}
                        >
                            O24 Documentation
                        </h2>
                        <p
                            className="text-white/40 text-base leading-relaxed"
                            style={{ fontFamily: "'Quicksand', sans-serif" }}
                        >
                            Your internal knowledge hub. Fast. Organized. Always up-to-date.
                        </p>

                        {/* Decorative line */}
                        <div className="mt-10 flex items-center justify-center gap-2">
                            <div className="h-px w-12 bg-white/10" />
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400/40" />
                            <div className="h-px w-12 bg-white/10" />
                        </div>
                    </div>
                </div>

                {/* Right side — login form */}
                <div className="flex-1 flex items-center justify-center px-6 bg-white dark:bg-neutral-950">
                    <div className="w-full max-w-sm">
                        {/* Mobile logo */}
                        <div className="lg:hidden mb-10 text-center">
                            <img
                                src="/images/general/logo.png"
                                alt="O24 Logo"
                                className="mx-auto h-10 mb-4"
                            />
                        </div>

                        <div className="mb-8">
                            <h1
                                className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white"
                                style={{ fontFamily: "'Quicksand', sans-serif" }}
                            >
                                Welcome back
                            </h1>
                            <p
                                className="mt-2 text-sm text-neutral-500 dark:text-neutral-400"
                                style={{ fontFamily: "'Quicksand', sans-serif" }}
                            >
                                Enter the password to access documentation
                            </p>
                        </div>

                        <form action={formAction} className="space-y-5">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                    style={{ fontFamily: "'Quicksand', sans-serif" }}
                                >
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        required
                                        className="h-11 w-full pr-10 rounded-lg border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 transition-colors focus:bg-white dark:focus:bg-neutral-800 focus:border-neutral-400 dark:focus:border-neutral-600"
                                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {state?.error && (
                                <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 px-4 py-3">
                                    <p
                                        className="text-sm text-red-600 dark:text-red-400"
                                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                                    >
                                        {state.error}
                                    </p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="h-11 w-full rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
                                style={{
                                    background: 'linear-gradient(135deg, #1e293b, #334155)',
                                    color: '#fff',
                                    fontFamily: "'Quicksand', sans-serif",
                                }}
                            >
                                {isPending ? (
                                    <span className="flex items-center gap-2">
                                        <svg
                                            className="h-4 w-4 animate-spin"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : (
                                    'Access Documentation'
                                )}
                            </Button>
                        </form>

                        <p
                            className="mt-8 text-center text-xs text-neutral-400 dark:text-neutral-600"
                            style={{ fontFamily: "'Quicksand', sans-serif" }}
                        >
                            Protected by O24 Platform
                        </p>
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes drift1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(60px, -40px) scale(1.1); }
                    50% { transform: translate(30px, 60px) scale(0.95); }
                    75% { transform: translate(-40px, 20px) scale(1.05); }
                }
                @keyframes drift2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(-50px, 30px) scale(1.05); }
                    50% { transform: translate(-20px, -50px) scale(1.1); }
                    75% { transform: translate(40px, -20px) scale(0.95); }
                }
                @keyframes drift3 {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    33% { transform: translate(-40%, -60%) scale(1.1); }
                    66% { transform: translate(-60%, -40%) scale(0.9); }
                }
            `}</style>
        </>
    )
}
