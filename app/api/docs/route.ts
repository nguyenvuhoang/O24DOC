import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('documents')
            .select('id, title, slug, description, category, displayorder, created_at, updated_at')
            .order('displayorder', { ascending: true })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ data })
    } catch (err) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title, slug, description, category, content } = body

        if (!title || !slug) {
            return NextResponse.json(
                { error: 'Title và slug là bắt buộc' },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('documents')
            .insert({
                title,
                slug,
                description: description || '',
                category: category || 'general',
                content: content || '',
                displayorder: body.displayorder || 0,
            })
            .select()
            .single()

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: `Slug "${slug}" đã tồn tại` },
                    { status: 409 }
                )
            }
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ data }, { status: 201 })
    } catch (err) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
