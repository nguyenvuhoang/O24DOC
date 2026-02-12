import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import './globals.css'
import { Metadata } from "next";
import { NextraSearchDialog } from "@/components/nextra-search-dialog";
import { getPagesFromPageMap } from "@/lib/getPagesFromPageMap";
import { FloatingActionButton } from "@/components/FloatingActionButton";

import { getDynamicPageMap } from '@/lib/dynamic-docs'

export const metadata: Metadata = {
    title: 'O24DOC',
    description: 'O24DOC is the documentation for O24, an open-source project that provides a comprehensive suite of tools for managing and automating various aspects of business operations.',
}

const navbar = (
    <Navbar
        projectLink="https://github.com/nguyenvuhoang/O24DOC"
        logo={<img src="/images/general/logo.png" alt="Logo" width={70} height={20} />}
    />
)
const footer = <Footer>MIT {new Date().getFullYear()} © O24.</Footer>

export default async function RootLayout({ children }) {
    const staticPageMap = await getPageMap();
    const dynamicItems = await getDynamicPageMap();

    // Prevent duplication: filter out dynamic items that already exist in static pageMap
    const staticRoutes = new Set();
    const collectRoutes = (items: any[]) => {
        for (const item of items) {
            if (item.route) {
                // Normalize route: remove trailing slash for comparison
                const normalized = item.route.replace(/\/$/, "");
                staticRoutes.add(normalized);
            }
            if (item.children) collectRoutes(item.children);
        }
    };
    collectRoutes(staticPageMap);

    const filteredDynamicItems = dynamicItems.filter(item => {
        const normalized = item.route.replace(/\/$/, "");
        return !staticRoutes.has(normalized);
    });

    // Find the 'docs' folder in the pageMap to insert dynamic items into it
    const pageMap = staticPageMap.map((item: any) => {
        if (item.name === 'docs' && item.children) {
            return {
                ...item,
                children: [...item.children, ...filteredDynamicItems]
            }
        }
        return item
    });

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
                <link rel="shortcut icon" href="/images/general/icon.png" />
            </Head>
            <body suppressHydrationWarning>
                <Layout
                    navbar={navbar}
                    pageMap={pageMap}
                    docsRepositoryBase="https://github.com/nguyenvuhoang/O24DOC/tree/main"
                    footer={footer}
                    search={<NextraSearchDialog pages={pages} />}
                >
                    {children}
                </Layout>
                <FloatingActionButton />
            </body>
        </html>
    )
}