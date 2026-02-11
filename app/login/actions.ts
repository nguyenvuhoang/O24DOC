'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
    const password = formData.get('password')
    const sitePassword = process.env.SITE_PASSWORD

    if (password === sitePassword) {
        const cookieStore = await cookies()
        cookieStore.set('site_access', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })
        redirect('/')
    } else {
        return { error: 'Incorrect password' }
    }
}
