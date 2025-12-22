import {Footer, Layout, Navbar} from 'nextra-theme-docs'
import {Head} from 'nextra/components'
import {getPageMap} from 'nextra/page-map'
import './globals.css'
import {Metadata} from "next";
import {NextraSearchDialog} from "@/components/nextra-search-dialog";
import {getPagesFromPageMap} from "@/lib/getPagesFromPageMap";

export const metadata: Metadata = {
    title: 'O24DOC',
    description: 'O24DOC is the documentation for O24, an open-source project that provides a comprehensive suite of tools for managing and automating various aspects of business operations.',
}

const navbar = (
    <Navbar
        projectLink="https://github.com/nguyenvuhoang/O24DOC"
        logo={<img src="/images/general/logo.png" alt="Logo" width={70} height={20}/>}
    />
)
const footer = <Footer>MIT {new Date().getFullYear()} © O24.</Footer>

export default async function RootLayout({children}) {
    const pageMap = await getPageMap();
    const pages = await getPagesFromPageMap({
        pageMapArray: pageMap,
    });


    return (
        <html
            lang="en"
            dir="ltr"
            suppressHydrationWarning
        >
        <Head
        >
            <link rel="shortcut icon" href="/images/general/icon.png"/>
        </Head>
        <body>
        <Layout
            navbar={navbar}
            pageMap={pageMap}
            docsRepositoryBase="https://github.com/nguyenvuhoang/O24DOC/tree/main"
            footer={footer}
            search={<NextraSearchDialog pages={pages}/>}
        >
            {children}
        </Layout>
        </body>
        </html>
    )
}