// app/(protected)/collections/page.tsx
import CollectionsPage from './CollectionsPage'

export default async function CollectionsPageServer() {
    return <CollectionsPage />
}

export const dynamic = 'force-dynamic' // Всегда получаем свежие данные
