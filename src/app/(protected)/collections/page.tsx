// app/(protected)/collections/page.tsx
import { getCollections } from '@/lib/collections/actions'
import { getItems } from '@/lib/items/actions'
import CollectionsPage from './CollectionsPage'

export default async function CollectionsPageServer() {
    // Загружаем коллекции и все items для подсчета статистики
    const [collections, items] = await Promise.all([
        getCollections(),
        getItems() // Получаем все items пользователя
    ])

    return <CollectionsPage initialCollections={collections} initialItems={items} />
}

export const dynamic = 'force-dynamic' // Всегда получаем свежие данные
