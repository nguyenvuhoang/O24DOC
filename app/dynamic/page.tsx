'use client'

import { useEffect, useState } from 'react'

interface Document {
    id: string
    title: string
    slug: string
    description: string
    category: string
    content: string
    displayorder: number
    created_at: string
    updated_at: string
}

export default function DynamicDocsPage() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        document.body.classList.add('login-page')
        return () => document.body.classList.remove('login-page')
    }, [])

    const loadDocuments = () => {
        setLoading(true)
        fetch('/api/docs')
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
            })
            .then((json) => setDocuments(json.data || []))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }

    useEffect(() => { loadDocuments() }, [])

    const handleSelectDoc = async (slug: string) => {
        try {
            const res = await fetch(`/api/docs/${slug}`)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const json = await res.json()
            setSelectedDoc(json.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load document')
        }
    }

    const handleDelete = async (slug: string, title: string) => {
        if (!confirm(`Bạn có chắc muốn xóa "${title}"?`)) return
        try {
            setDeleting(slug)
            const res = await fetch(`/api/docs/${slug}`, { method: 'DELETE' })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            setDocuments((prev) => prev.filter((d) => d.slug !== slug))
            if (selectedDoc?.slug === slug) setSelectedDoc(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi khi xóa')
        } finally {
            setDeleting(null)
        }
    }

    if (loading) {
        return (
            <>
                <PageStyles />
                <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-950">
                    <div className="flex items-center gap-3 text-neutral-500">
                        <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span style={{ fontFamily: "'Quicksand', sans-serif" }}>Đang tải tài liệu...</span>
                    </div>
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <PageStyles />
                <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-950">
                    <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30">
                        <p className="text-lg font-semibold text-red-600 dark:text-red-400" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                            Không thể tải dữ liệu
                        </p>
                        <p className="mt-2 text-sm text-red-500">{error}</p>
                        <button
                            onClick={() => { setError(null); loadDocuments() }}
                            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </>
        )
    }

    // Show single document detail
    if (selectedDoc) {
        return (
            <>
                <PageStyles />
                <div className="min-h-screen bg-white dark:bg-neutral-950" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                    <div className="mx-auto max-w-4xl px-6 py-10">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => setSelectedDoc(null)}
                                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                Quay lại danh sách
                            </button>
                            <a
                                href={`/dynamic/editor?edit=${selectedDoc.slug}`}
                                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Chỉnh sửa
                            </a>
                        </div>

                        <div className="mb-4">
                            <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                {selectedDoc.category}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                            {selectedDoc.title}
                        </h1>
                        {selectedDoc.description && (
                            <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-6">
                                {selectedDoc.description}
                            </p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-neutral-400 mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-800">
                            <span>📅 {new Date(selectedDoc.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                            {selectedDoc.updated_at && selectedDoc.updated_at !== selectedDoc.created_at && (
                                <span>✏️ Cập nhật: {new Date(selectedDoc.updated_at).toLocaleDateString('vi-VN')}</span>
                            )}
                        </div>

                        <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                            {selectedDoc.content}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    // Show documents list
    const categories = [...new Set(documents.map((d) => d.category))].filter(Boolean)

    return (
        <>
            <PageStyles />
            <div className="min-h-screen bg-white dark:bg-neutral-950" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                {/* Header */}
                <div className="border-b border-neutral-200 dark:border-neutral-800">
                    <div className="mx-auto max-w-5xl px-6 py-10">
                        <div className="flex items-center gap-4 mb-4">
                            <a
                                href="/"
                                className="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                            >
                                ← Trang chủ
                            </a>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                                    📄 Tài Liệu Động
                                </h1>
                                <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                                    Quản lý nội dung tài liệu — tạo, chỉnh sửa và lưu trữ trong database.
                                    {documents.length > 0 && (
                                        <> Tổng cộng <strong className="text-indigo-600 dark:text-indigo-400">{documents.length}</strong> tài liệu.</>
                                    )}
                                </p>
                            </div>
                            <a
                                href="/dynamic/editor"
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-purple-500 active:scale-95 whitespace-nowrap"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14" />
                                    <path d="M5 12h14" />
                                </svg>
                                Tạo mới
                            </a>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto max-w-5xl px-6 py-8">
                    {categories.map((category) => (
                        <div key={category} className="mb-10">
                            <h2 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                {category}
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {documents
                                    .filter((doc) => doc.category === category)
                                    .map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="group rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-indigo-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-indigo-700"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <button
                                                    onClick={() => handleSelectDoc(doc.slug)}
                                                    className="flex-1 text-left"
                                                >
                                                    <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                                                        <span className="flex h-5 w-5 items-center justify-center rounded bg-neutral-100 text-[10px] font-bold text-neutral-500 dark:bg-neutral-800">
                                                            {doc.displayorder || 0}
                                                        </span>
                                                        {doc.title}
                                                    </h3>
                                                    {doc.description && (
                                                        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                                                            {doc.description}
                                                        </p>
                                                    )}
                                                </button>

                                                {/* Actions */}
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <a
                                                        href={`/dynamic/editor?edit=${doc.slug}`}
                                                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </a>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(doc.slug, doc.title) }}
                                                        disabled={deleting === doc.slug}
                                                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                                                        title="Xóa"
                                                    >
                                                        {deleting === doc.slug ? (
                                                            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="3 6 5 6 21 6" />
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-3 text-xs text-neutral-400">
                                                {new Date(doc.created_at).toLocaleDateString('vi-VN')}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}

                    {documents.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium text-neutral-600 dark:text-neutral-300">Không tìm thấy tài liệu nào trong Database</p>
                            <p className="mt-2 text-sm text-neutral-400 max-w-sm mx-auto">
                                Nếu bạn đã lưu dữ liệu trong bảng <strong>documents</strong> mà không thấy hiển thị, hãy kiểm tra:
                                <ul className="mt-3 text-left space-y-1 list-disc list-inside">
                                    <li>Lớp bảo mật <strong>RLS</strong> của Supabase đã được tắt hoặc cấu hình để cho phép đọc?</li>
                                    <li>Biến môi trường <strong>SUPABASE_SERVICE_KEY</strong> có đúng là Service Role Secret?</li>
                                    <li>Bạn đã restart server sau khi sửa file <strong>.env</strong> chưa?</li>
                                </ul>
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <button
                                    onClick={loadDocuments}
                                    className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                                >
                                    🔄 Tải lại dữ liệu
                                </button>
                                <a
                                    href="/dynamic/editor"
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-indigo-500/40 active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 5v14" />
                                        <path d="M5 12h14" />
                                    </svg>
                                    Tạo tài liệu mới
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

function PageStyles() {
    return (
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
        `}</style>
    )
}
