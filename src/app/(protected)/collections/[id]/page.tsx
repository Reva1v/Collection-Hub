// app/(protected)/collections/[id]/page.tsx
import {getCollectionWithItems} from '@/lib/collections/actions'
import {getUniqueTypes} from '@/lib/items/actions'
import ItemsPage from '@/components/ItemsPage/ItemsPage.tsx'

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({params}: PageProps) {
    const {id} = await params;

    const collectionWithItems = await getCollectionWithItems(id);

    if (!collectionWithItems) {
        return <div>Collection not found</div>;
    }

    const uniqueTypes = await getUniqueTypes(id);

    return (
        <ItemsPage
            collections={[collectionWithItems]}
            items={collectionWithItems.items}
            selectedCollectionId={id}
            uniqueTypes={uniqueTypes}
        />
    );
}
