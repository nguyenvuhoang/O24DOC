import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params

        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('slug', slug)
            .single()

        if (error) {
            return NextResponse.json(
                { error: 'Document not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ data })
    } catch (err) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params
        const body = await request.json()
        const { title, description, category, content } = body

        const { data, error } = await supabase
            .from('documents')
            .update({
                title,
                description,
                category,
                content,
                displayorder: body.displayorder,
                updated_at: new Date().toISOString(),
            })
            .eq('slug', slug)
            .select()
            .single()

        if (error) {
            return NextResponse.json(
                { error: 'Không thể cập nhật tài liệu' },
                { status: 404 }
            )
        }

        return NextResponse.json({ data })
    } catch (err) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params

        const { error } = await supabase
            .from('documents')
            .delete()
            .eq('slug', slug)

        if (error) {
            return NextResponse.json(
                { error: 'Không thể xóa tài liệu' },
                { status: 500 }
            )
        }

        return NextResponse.json({ message: 'Đã xóa thành công' })
    } catch (err) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
