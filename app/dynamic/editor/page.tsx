'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

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

const CATEGORIES = [
    { value: 'general', label: '📁 General' },
    { value: 'docs', label: '📖 Documentation' },
    { value: 'srs', label: '📋 SRS' },
    { value: 'guide', label: '🎯 Guide' },
    { value: 'api', label: '⚡ API' },
    { value: 'design', label: '🎨 Design' },
    { value: 'blog', label: '✍️ Blog' },
]

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}

export default function EditorPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const editSlug = searchParams.get('edit')

    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('general')
    const [content, setContent] = useState('')
    const [displayOrder, setDisplayOrder] = useState(0)
    const [autoSlug, setAutoSlug] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(!!editSlug)
    const [showPreview, setShowPreview] = useState(false)
    const [darkMode, setDarkMode] = useState(false)

    const isEditing = !!editSlug

    // Hide Nextra chrome
    useEffect(() => {
        document.body.classList.add('login-page')
        return () => document.body.classList.remove('login-page')
    }, [])

    // Init theme from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('editor-theme')
        if (saved === 'dark') setDarkMode(true)
    }, [])

    // Load existing doc when editing
    useEffect(() => {
        if (!editSlug) return
        fetch(`/api/docs/${editSlug}`)
            .then((res) => {
                if (!res.ok) throw new Error('Không tìm thấy tài liệu')
                return res.json()
            })
            .then((json) => {
                const doc: Document = json.data
                setTitle(doc.title)
                setSlug(doc.slug)
                setDescription(doc.description || '')
                setCategory(doc.category || 'general')
                setContent(doc.content || '')
                setDisplayOrder(doc.displayorder || 0)
                setAutoSlug(false)
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [editSlug])

    // Auto-generate slug from title
    useEffect(() => {
        if (autoSlug && !isEditing) {
            setSlug(generateSlug(title))
        }
    }, [title, autoSlug, isEditing])

    const toggleTheme = () => {
        setDarkMode((prev) => {
            const next = !prev
            localStorage.setItem('editor-theme', next ? 'dark' : 'light')
            return next
        })
    }

    const handleSave = useCallback(async () => {
        if (!title.trim()) {
            setError('Tiêu đề không được để trống')
            return
        }
        if (!slug.trim()) {
            setError('Slug không được để trống')
            return
        }

        try {
            setSaving(true)
            setError(null)
            setSaved(false)

            const body = { title, slug, description, category, content, displayorder: displayOrder }

            const res = isEditing
                ? await fetch(`/api/docs/${editSlug}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                })
                : await fetch('/api/docs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                })

            if (!res.ok) {
                const json = await res.json()
                throw new Error(json.error || `HTTP ${res.status}`)
            }

            setSaved(true)
            setTimeout(() => setSaved(false), 3000)

            if (!isEditing) {
                const json = await res.json()
                router.replace(`/dynamic/editor?edit=${json.data?.slug || slug}`)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi khi lưu')
        } finally {
            setSaving(false)
        }
    }, [title, slug, description, category, content, displayOrder, isEditing, editSlug, router])

    // Keyboard shortcut: Ctrl+S to save
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault()
                handleSave()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleSave])

    // Theme CSS variables
    const theme = darkMode
        ? {
            bg: '#1a1d2e',
            bgSurface: '#222640',
            bgElevated: '#2a2e4a',
            bgInput: '#2f345a',
            border: '#3d4270',
            borderFocus: '#7c83d4',
            text: '#e8eaf0',
            textSecondary: '#a0a5c8',
            textMuted: '#6b70a0',
            accent: '#8b93e8',
            accentHover: '#a0a8f0',
            accentBg: 'rgba(139,147,232,0.12)',
            topBar: 'rgba(34,38,64,0.85)',
            editorBg: '#1e2238',
            placeholder: '#505580',
            success: '#6ee7a8',
            error: '#f87171',
            errorBg: 'rgba(248,113,113,0.1)',
            errorBorder: 'rgba(248,113,113,0.2)',
            shadow: 'rgba(0,0,0,0.3)',
            gradient1: '#7c83d4',
            gradient2: '#b088f9',
        }
        : {
            bg: '#f0f4ff',
            bgSurface: '#ffffff',
            bgElevated: '#ffffff',
            bgInput: '#f5f7fc',
            border: '#e0e5f2',
            borderFocus: '#7c83d4',
            text: '#1e2240',
            textSecondary: '#5a5f80',
            textMuted: '#9098b8',
            accent: '#6366f1',
            accentHover: '#5558e8',
            accentBg: 'rgba(99,102,241,0.08)',
            topBar: 'rgba(255,255,255,0.85)',
            editorBg: '#fafbff',
            placeholder: '#c0c6e0',
            success: '#10b981',
            error: '#ef4444',
            errorBg: 'rgba(239,68,68,0.06)',
            errorBorder: 'rgba(239,68,68,0.15)',
            shadow: 'rgba(100,110,180,0.08)',
            gradient1: '#6366f1',
            gradient2: '#a855f7',
        }

    if (loading) {
        return (
            <>
                <EditorStyles />
                <div style={{ background: theme.bg, color: theme.text, fontFamily: "'Quicksand', 'Inter', sans-serif" }} className="flex min-h-screen items-center justify-center">
                    <div className="flex items-center gap-3" style={{ color: theme.textMuted }}>
                        <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Đang tải...</span>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <EditorStyles />
            <div style={{ background: theme.bg, color: theme.text, fontFamily: "'Quicksand', 'Inter', sans-serif", minHeight: '100vh', transition: 'background 0.3s ease, color 0.3s ease' }}>
                {/* Top bar */}
                <div style={{ background: theme.topBar, borderBottom: `1px solid ${theme.border}`, backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 50, transition: 'background 0.3s ease, border-color 0.3s ease' }}>
                    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <a
                                href="/dynamic"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', color: theme.textSecondary, textDecoration: 'none', transition: 'all 0.2s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = theme.accentBg; e.currentTarget.style.color = theme.accent }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = theme.textSecondary }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                Quay lại
                            </a>
                            <div style={{ height: '1.25rem', width: '1px', background: theme.border }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: theme.text }}>
                                {isEditing ? '✏️ Chỉnh sửa' : '✨ Tạo mới'}
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {/* Theme toggle */}
                            <button
                                onClick={toggleTheme}
                                title={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: '2rem', height: '2rem', borderRadius: '0.5rem',
                                    border: `1px solid ${theme.border}`, background: theme.bgSurface,
                                    color: theme.textSecondary, cursor: 'pointer', transition: 'all 0.2s',
                                    fontSize: '1rem',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = theme.accentBg; e.currentTarget.style.color = theme.accent; e.currentTarget.style.borderColor = theme.accent }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = theme.bgSurface; e.currentTarget.style.color = theme.textSecondary; e.currentTarget.style.borderColor = theme.border }}
                            >
                                {darkMode ? '☀️' : '🌙'}
                            </button>

                            {/* Preview toggle */}
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                                    padding: '0.375rem 0.75rem', borderRadius: '0.5rem',
                                    fontSize: '0.875rem', fontWeight: 500, border: 'none', cursor: 'pointer',
                                    background: showPreview ? theme.accentBg : 'transparent',
                                    color: showPreview ? theme.accent : theme.textSecondary,
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => { if (!showPreview) { e.currentTarget.style.background = theme.accentBg } }}
                                onMouseLeave={(e) => { if (!showPreview) { e.currentTarget.style.background = 'transparent' } }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                Preview
                            </button>

                            {/* Save status */}
                            {saved && (
                                <span className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: theme.success, fontWeight: 600 }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    Đã lưu
                                </span>
                            )}

                            {/* Save button */}
                            <button
                                onClick={handleSave}
                                disabled={saving || !title.trim()}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.5rem 1rem', borderRadius: '0.625rem',
                                    background: `linear-gradient(135deg, ${theme.gradient1}, ${theme.gradient2})`,
                                    color: '#fff', fontSize: '0.875rem', fontWeight: 700,
                                    border: 'none', cursor: saving || !title.trim() ? 'not-allowed' : 'pointer',
                                    opacity: saving || !title.trim() ? 0.5 : 1,
                                    boxShadow: `0 4px 14px ${theme.gradient1}40`,
                                    transition: 'all 0.2s',
                                }}
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin" style={{ width: '1rem', height: '1rem' }} viewBox="0 0 24 24" fill="none">
                                            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                            <polyline points="17 21 17 13 7 13 7 21" />
                                            <polyline points="7 3 7 8 15 8" />
                                        </svg>
                                        Lưu · Ctrl+S
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error banner */}
                {error && (
                    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '1rem 1.5rem 0' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            borderRadius: '0.75rem', padding: '0.75rem 1rem',
                            background: theme.errorBg, border: `1px solid ${theme.errorBorder}`,
                            fontSize: '0.875rem', color: theme.error,
                        }}>
                            <span>⚠️ {error}</span>
                            <button onClick={() => setError(null)} style={{ color: theme.error, background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7, fontSize: '1rem' }}>✕</button>
                        </div>
                    </div>
                )}

                {/* Main editor area */}
                <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem 1.5rem' }}>
                    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr' }}>
                        {/* Editor column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Title */}
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Tiêu đề tài liệu..."
                                style={{
                                    width: '100%', border: 'none', background: 'transparent',
                                    fontSize: '2rem', fontWeight: 800, color: theme.text,
                                    outline: 'none', fontFamily: "'Quicksand', sans-serif",
                                    letterSpacing: '-0.02em',
                                }}
                            />

                            {/* Description */}
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Mô tả ngắn..."
                                style={{
                                    width: '100%', border: 'none', background: 'transparent',
                                    fontSize: '1.125rem', color: theme.textSecondary,
                                    outline: 'none', fontFamily: "'Quicksand', sans-serif",
                                }}
                            />

                            {/* Metadata row */}
                            <div style={{
                                display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem',
                                borderRadius: '0.875rem', border: `1px solid ${theme.border}`,
                                background: theme.bgSurface, padding: '1rem',
                                boxShadow: `0 1px 3px ${theme.shadow}`,
                                transition: 'all 0.3s ease',
                            }}>
                                {/* Slug */}
                                <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: '0.5rem', minWidth: '200px' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: theme.textMuted }}>Slug</span>
                                    <div style={{
                                        display: 'flex', flex: 1, alignItems: 'center', gap: '0.25rem',
                                        borderRadius: '0.5rem', border: `1px solid ${theme.border}`,
                                        background: theme.bgInput, padding: '0.375rem 0.75rem',
                                    }}>
                                        <span style={{ fontSize: '0.75rem', color: theme.textMuted }}>/docs/</span>
                                        <input
                                            type="text"
                                            value={slug}
                                            onChange={(e) => { setAutoSlug(false); setSlug(e.target.value) }}
                                            style={{
                                                flex: 1, border: 'none', background: 'transparent',
                                                fontSize: '0.875rem', color: theme.text, outline: 'none',
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: theme.textMuted }}>Category</span>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        style={{
                                            borderRadius: '0.5rem', border: `1px solid ${theme.border}`,
                                            background: theme.bgInput, padding: '0.375rem 0.75rem',
                                            fontSize: '0.875rem', color: theme.text, outline: 'none',
                                        }}
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ height: '1.5rem', width: '1px', background: theme.border, margin: '0 0.25rem' }} />

                                {/* Display Order */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: theme.textMuted }}>Order</span>
                                    <input
                                        type="number"
                                        value={displayOrder}
                                        onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                                        style={{
                                            width: '60px',
                                            borderRadius: '0.5rem', border: `1px solid ${theme.border}`,
                                            background: theme.bgInput, padding: '0.375rem 0.5rem',
                                            fontSize: '0.875rem', color: theme.text, outline: 'none',
                                            textAlign: 'center'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Content editor */}
                            <div style={{
                                borderRadius: '0.875rem', border: `1px solid ${theme.border}`,
                                background: theme.bgSurface, overflow: 'hidden',
                                boxShadow: `0 2px 8px ${theme.shadow}`,
                                transition: 'all 0.3s ease',
                            }}>
                                {/* Toolbar */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '2px',
                                    borderBottom: `1px solid ${theme.border}`,
                                    padding: '0.5rem 0.75rem', background: theme.bgElevated,
                                    transition: 'background 0.3s ease',
                                }}>
                                    <ToolbarBtn theme={theme} onClick={() => insertMarkdown('**', '**')} title="Bold"><strong>B</strong></ToolbarBtn>
                                    <ToolbarBtn theme={theme} onClick={() => insertMarkdown('*', '*')} title="Italic"><em>I</em></ToolbarBtn>
                                    <ToolbarBtn theme={theme} onClick={() => insertMarkdown('~~', '~~')} title="Strikethrough"><s>S</s></ToolbarBtn>
                                    <ToolbarSep theme={theme} />
                                    <ToolbarBtn theme={theme} onClick={() => insertPrefix('# ')} title="Heading 1">H1</ToolbarBtn>
                                    <ToolbarBtn theme={theme} onClick={() => insertPrefix('## ')} title="Heading 2">H2</ToolbarBtn>
                                    <ToolbarBtn theme={theme} onClick={() => insertPrefix('### ')} title="Heading 3">H3</ToolbarBtn>
                                    <ToolbarSep theme={theme} />
                                    <ToolbarBtn theme={theme} onClick={() => insertPrefix('- ')} title="Bullet list">•</ToolbarBtn>
                                    <ToolbarBtn theme={theme} onClick={() => insertPrefix('1. ')} title="Numbered list">1.</ToolbarBtn>
                                    <ToolbarBtn theme={theme} onClick={() => insertPrefix('> ')} title="Quote">&ldquo;</ToolbarBtn>
                                    <ToolbarSep theme={theme} />
                                    <ToolbarBtn theme={theme} onClick={() => insertMarkdown('`', '`')} title="Inline code">{'</>'}</ToolbarBtn>
                                    <ToolbarBtn theme={theme} onClick={() => insertBlock('```\n', '\n```')} title="Code block">{'{ }'}</ToolbarBtn>
                                    <ToolbarBtn theme={theme} onClick={() => insertMarkdown('[', '](url)')} title="Link">🔗</ToolbarBtn>
                                    <ToolbarBtn theme={theme} onClick={() => insertBlock('\n| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n', '')} title="Table">⊞</ToolbarBtn>
                                    <ToolbarBtn theme={theme} onClick={() => insertBlock('\n---\n', '')} title="Horizontal rule">─</ToolbarBtn>
                                </div>

                                {/* Textarea */}
                                <textarea
                                    id="editor-content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder={`Viết nội dung tài liệu bằng Markdown...

# Tiêu đề chính

## Tiêu đề phụ

Đoạn văn bản với **in đậm** và *in nghiêng*.

- Danh sách item 1
- Danh sách item 2

> Trích dẫn`}
                                    style={{
                                        width: '100%', minHeight: '500px', resize: 'none',
                                        border: 'none', background: theme.editorBg,
                                        padding: '1.5rem', fontSize: '0.9375rem',
                                        lineHeight: 1.8, color: theme.text,
                                        outline: 'none', fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                        transition: 'background 0.3s ease',
                                    }}
                                    spellCheck={false}
                                />

                                {/* Word count */}
                                <div style={{
                                    borderTop: `1px solid ${theme.border}`,
                                    padding: '0.5rem 1rem', fontSize: '0.75rem',
                                    color: theme.textMuted, background: theme.bgElevated,
                                    display: 'flex', justifyContent: 'space-between',
                                    transition: 'all 0.3s ease',
                                }}>
                                    <span>{content.length} ký tự · {content.split(/\s+/).filter(Boolean).length} từ · {content.split('\n').length} dòng</span>
                                    <span style={{ opacity: 0.6 }}>Markdown</span>
                                </div>
                            </div>
                        </div>

                        {/* Preview column */}
                        {showPreview && (
                            <div style={{
                                borderRadius: '0.875rem', border: `1px solid ${theme.border}`,
                                background: theme.bgSurface, padding: '2rem',
                                boxShadow: `0 2px 8px ${theme.shadow}`,
                                transition: 'all 0.3s ease', alignSelf: 'start',
                                position: 'sticky', top: '5rem',
                            }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    borderBottom: `1px solid ${theme.border}`, paddingBottom: '0.75rem', marginBottom: '1rem',
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: theme.textMuted }}>Xem trước</span>
                                </div>
                                <div>
                                    {title && <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: theme.text, marginBottom: '0.5rem' }}>{title}</h1>}
                                    {description && <p style={{ color: theme.textSecondary, fontStyle: 'italic', marginBottom: '1rem' }}>{description}</p>}
                                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75, fontSize: '0.9375rem', color: theme.text }}>
                                        {content || <span style={{ color: theme.textMuted }}>Chưa có nội dung...</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )

    function insertMarkdown(before: string, after: string) {
        const textarea = document.getElementById('editor-content') as HTMLTextAreaElement
        if (!textarea) return
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selected = content.substring(start, end)
        const newContent = content.substring(0, start) + before + (selected || 'text') + after + content.substring(end)
        setContent(newContent)
        setTimeout(() => {
            textarea.focus()
            textarea.selectionStart = start + before.length
            textarea.selectionEnd = start + before.length + (selected || 'text').length
        }, 0)
    }

    function insertPrefix(prefix: string) {
        const textarea = document.getElementById('editor-content') as HTMLTextAreaElement
        if (!textarea) return
        const start = textarea.selectionStart
        const lineStart = content.lastIndexOf('\n', start - 1) + 1
        const newContent = content.substring(0, lineStart) + prefix + content.substring(lineStart)
        setContent(newContent)
        setTimeout(() => {
            textarea.focus()
            textarea.selectionStart = textarea.selectionEnd = start + prefix.length
        }, 0)
    }

    function insertBlock(before: string, after: string) {
        const textarea = document.getElementById('editor-content') as HTMLTextAreaElement
        if (!textarea) return
        const start = textarea.selectionStart
        const newContent = content.substring(0, start) + before + after + content.substring(start)
        setContent(newContent)
        setTimeout(() => {
            textarea.focus()
            textarea.selectionStart = textarea.selectionEnd = start + before.length
        }, 0)
    }
}

interface ThemeColors {
    textMuted: string
    textSecondary: string
    accent: string
    accentBg: string
    border: string
}

function ToolbarBtn({ children, onClick, title, theme }: { children: React.ReactNode; onClick: () => void; title: string; theme: ThemeColors }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '1.75rem', minWidth: '1.75rem', borderRadius: '0.375rem',
                padding: '0 0.375rem', fontSize: '0.75rem', fontWeight: 600,
                color: theme.textSecondary, background: 'transparent',
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = theme.accentBg; e.currentTarget.style.color = theme.accent }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = theme.textSecondary }}
        >
            {children}
        </button>
    )
}

function ToolbarSep({ theme }: { theme: ThemeColors }) {
    return <div style={{ height: '1rem', width: '1px', background: theme.border, margin: '0 0.25rem' }} />
}

function EditorStyles() {
    return (
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
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
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(-4px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fade-in 0.3s ease-out;
            }
            .animate-spin {
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            ::placeholder {
                transition: color 0.3s ease;
            }
        `}</style>
    )
}
