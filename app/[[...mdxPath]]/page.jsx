import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { getPageMap } from 'nextra/page-map'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { supabase } from '@/lib/db'
import { DynamicRenderer } from '@/components/DynamicRenderer'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props) {
    const params = await props.params
    const pageMap = await getPageMap()
    const routeExistsStatic = checkRouteExists(pageMap, params.mdxPath)

    if (routeExistsStatic) {
        try {
            const { metadata } = await importPage(params.mdxPath)
            return metadata
        } catch (e) {
            // Fallback
        }
    }

    const slug = params.mdxPath?.[params.mdxPath.length - 1]
    if (!slug) return {}

    const { data } = await supabase
        .from('documents')
        .select('title, description')
        .eq('slug', slug)
        .single()
    
    return {
        title: data?.title || 'Tài liệu',
        description: data?.description || ''
    }
}

const Wrapper = getMDXComponents().wrapper

function checkRouteExists(pageMap, targetSegments) {
    if (!targetSegments || targetSegments.length === 0) return true; // root exists

    const targetRoute = '/' + targetSegments.join('/');
    
    const findInItems = (items) => {
        for (const item of items) {
            if (item.route === targetRoute) return true;
            if (item.children) {
                if (findInItems(item.children)) return true;
            }
        }
        return false;
    };

    return findInItems(pageMap);
}

export default async function Page(props) {
    const params = await props.params
    let result
    let isDynamic = false
    let dynamicData = null

    const pageMap = await getPageMap()
    const routeExistsStatic = checkRouteExists(pageMap, params.mdxPath)

    if (routeExistsStatic) {
        try {
            result = await importPage(params.mdxPath)
        } catch (e) {
            // This case should theoretically be covered by checkRouteExists, 
            // but we keep the catch just in case.
            console.warn(`[Page] importPage failed for existing static route: ${params.mdxPath?.join('/')}`);
        }
    }

    if (!result) {
        // If not a static file, check Supabase
        const pathSegments = params.mdxPath || []
        const slug = pathSegments[pathSegments.length - 1]
        
        if (slug) {
            const { data } = await supabase
                .from('documents')
                .select('*')
                .eq('slug', slug)
                .single()
            
            if (data) {
                isDynamic = true
                dynamicData = data
            }
        }
        
        // If still not found and not dynamic, we should 404
        if (!isDynamic) {
             // We can't easily throw e anymore since we might not have it, 
             // so we'll just return null or throw a generic 404 to trigger Nextra.
             // Actually, importPage usually handles the 404 UI if called.
             // But if we want to BE SURE we don't trigger that Turbopack error:
             return <div>Page Not Found</div> // Or a better 404 component
        }
    }

    if (isDynamic) {
        // More robust TOC extraction (H1, H2, H3)
        const toc = []
        const lines = dynamicData.content.split('\n')
        lines.forEach(line => {
            const match = line.match(/^(#|##|###) (.*)$/)
            if (match) {
                const level = match[1].length
                const title = match[2].trim()
                // Simple slugify for IDs
                const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                toc.push({ 
                    value: title, 
                    id, 
                    depth: level 
                })
            }
        })

        return (
            <Wrapper toc={toc} metadata={{ title: dynamicData.title }}>
                <DynamicRenderer 
                    content={dynamicData.content} 
                    title={dynamicData.title}
                    category={dynamicData.category}
                    description={dynamicData.description}
                />
            </Wrapper>
        )
    }

    const { default: MDXContent, toc, metadata } = result
    return (
        <Wrapper toc={toc} metadata={metadata}>
            <MDXContent {...props} params={params} />
        </Wrapper>
    )
}
