// app/(protected)/collections/[id]/page.tsx
import { getCollectionWithItems } from '@/lib/collections/actions'
import { getUniqueTypes } from '@/lib/items/actions'
import ItemsPage from '@/components/ItemsPage/ItemsPage.tsx' // можно переиспользовать компонент

export default async function Page({ params }: { params: { id: string } }) {
    const collectionWithItems = await getCollectionWithItems(params.id)

    if (!collectionWithItems) {
        return <div>Collection not found</div>
    }

    const uniqueTypes = await getUniqueTypes(params.id)

    return (
        <ItemsPage
            collections={[collectionWithItems]}
            items={collectionWithItems.items}
            selectedCollectionId={params.id}
            uniqueTypes={uniqueTypes}
        />
    )
}
