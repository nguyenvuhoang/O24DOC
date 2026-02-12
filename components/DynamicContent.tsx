'use client'

import { useEffect, useState } from 'react'

interface Document {
    id: string
    title: string
    slug: string
    description: string
    category: string
    content: string
    created_at: string
    updated_at: string
}

interface DynamicContentProps {
    /** API endpoint relative to /api/ — e.g. "docs" or "docs/my-slug" */
    endpoint: string
}

export function DynamicContent({ endpoint }: DynamicContentProps) {
    const [data, setData] = useState<Document[] | Document | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await fetch(`/api/${endpoint}`)
                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status}`)
                }
                const json = await res.json()
                setData(json.data)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Something went wrong')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [endpoint])

    if (loading) {
        return (
            <div className="flex items-center gap-2 py-6 text-neutral-500">
                <svg
                    className="h-5 w-5 animate-spin"
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
                <span>Đang tải dữ liệu...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                Lỗi: {error}
            </div>
        )
    }

    if (!data) {
        return (
            <div className="py-4 text-neutral-500">
                Không tìm thấy dữ liệu.
            </div>
        )
    }

    // Render a list of documents
    if (Array.isArray(data)) {
        return (
            <div className="space-y-4">
                {data.map((doc) => (
                    <div
                        key={doc.id}
                        className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            {doc.title}
                        </h3>
                        {doc.description && (
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                {doc.description}
                            </p>
                        )}
                        <div className="mt-3 flex items-center gap-3 text-xs text-neutral-400">
                            {doc.category && (
                                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 font-medium text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                    {doc.category}
                                </span>
                            )}
                            <span>
                                {new Date(doc.created_at).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    </div>
                ))}
                {data.length === 0 && (
                    <p className="py-4 text-neutral-500">Chưa có tài liệu nào.</p>
                )}
            </div>
        )
    }

    // Render a single document
    return (
        <article className="prose prose-neutral dark:prose-invert max-w-none">
            <h1>{data.title}</h1>
            {data.description && (
                <p className="lead">{data.description}</p>
            )}
            <div
                dangerouslySetInnerHTML={{ __html: data.content || '' }}
            />
            <div className="mt-8 border-t border-neutral-200 pt-4 text-sm text-neutral-400 dark:border-neutral-800">
                Cập nhật: {new Date(data.updated_at || data.created_at).toLocaleDateString('vi-VN')}
            </div>
        </article>
    )
}
