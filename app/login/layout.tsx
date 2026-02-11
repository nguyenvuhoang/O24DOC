import { Quicksand } from 'next/font/google'

const quicksand = Quicksand({
    subsets: ['latin', 'vietnamese'],
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
})

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={quicksand.className}>
            {children}
        </div>
    )
}
