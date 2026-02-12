import { supabase } from './db'

export async function getDynamicPageMap() {
    try {
        const { data, error } = await supabase
            .from('documents')
            .select('title, slug, category, description, displayorder')
            .order('displayorder', { ascending: true })

        if (error || !data) return []

        const srsDocs = data.filter(doc => doc.category === 'srs')
        const otherDocs = data.filter(doc => doc.category !== 'srs')

        const dynamicItems: any[] = []

        // Group SRS items into a folder if any exist
        if (srsDocs.length > 0) {
            dynamicItems.push({
                name: 'srs',
                route: '/docs/srs',
                title: 'Đặc tả yêu cầu phần mềm (SRS)',
                type: 'folder', // Change to folder for grouping
                children: srsDocs.map(doc => ({
                    name: doc.slug,
                    route: `/docs/srs/${doc.slug}`,
                    title: doc.title,
                    type: 'page',
                    frontMatter: {
                        title: doc.title,
                        description: doc.description,
                    }
                }))
            })
        }

        // Add other documents flat or could be grouped later
        otherDocs.forEach(doc => {
            dynamicItems.push({
                name: doc.slug,
                route: `/docs/${doc.slug}`,
                title: doc.title,
                type: 'page',
                frontMatter: {
                    title: doc.title,
                    description: doc.description,
                }
            })
        })

        return dynamicItems
    } catch (err) {
        console.error('Error fetching dynamic pageMap:', err)
        return []
    }
}
