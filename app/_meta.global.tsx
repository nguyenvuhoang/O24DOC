import { MetaRecord } from "nextra";


const DOCS_ITEMS: MetaRecord = {
    index: { title: "Tổng quan" },
    srs: {
        title: "Đặc tả yêu cầu phần mềm (SRS)",
        items: {
            index: { title: "1. Giới Thiệu" },
            overall: { title: "2. Mô Tả Tổng Quan" },
            architecture: { title: "3. Kiến Trúc Hệ Thống" },
            "functional-requirements": { title: "4. Yêu Cầu Chức Năng" },
            "non-functional-requirements": { title: "5. Yêu Cầu Phi Chức Năng" },
            "data-requirements": { title: "6. Yêu Cầu Dữ Liệu" },
            "api-requirements": { title: "7. Yêu Cầu API" },
            "workflow-requirements": { title: "8. Yêu Cầu Workflow" },
            "assumptions-risks": { title: "9. Giả Định & Rủi Ro" },
            "design-requirements": { title: "10. Yêu Cầu Thiết Kế" },
            "future-enhancements": { title: "11. Hướng Phát Triển" }
        }
    }
};


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
    dynamic: {
        title: '📄 Tài Liệu Động',
        type: 'page',
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
    login: {
        title: 'Login',
        display: 'hidden',
    },
}