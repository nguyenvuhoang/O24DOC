import {MetaRecord} from "nextra";

const DOCS_ITEMS: MetaRecord = {
    index: '',
    tips: '',
}


export default {
    index: {
        type: 'page',
        theme: {
            layout: 'full',
            toc: false,
            timestamp: false,
        }
    },
    docs: {
        type: 'page',
        title: 'Documentation',
        items: DOCS_ITEMS
    },
    contact: {
        type: 'page',
        theme: {
            layout: 'full',
            toc: false,
            timestamp: false,
        }
    },
    nextraStarter: {
        title: 'Starter Templates',
        type: 'menu',
        items: {
            docs: {
                title: 'Docs Starter repo',
                href: 'https://github.com/nguyenvuhoang/O24DOC',
            },
            blog: {
                title: 'Blog Starter repo',
                href: 'https://github.com/nguyenvuhoang/nextra-blog-starter'
            }
        }
    },
}