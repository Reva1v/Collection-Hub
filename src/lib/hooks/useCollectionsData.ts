import * as React from 'react'
import {getCollections} from '@/lib/collections/actions.ts'
import {Collection} from '@/lib/types/Collection.ts'
import {Item} from '@/lib/types/Item.ts'
import {getItems} from "@/lib/items/actions.ts";

interface DataState {
    collections: Collection[]
    items: Item[]
    isLoading: boolean
    error: string | null
}

export const useCollectionsData = () => {
    const [state, setState] = React.useState<DataState>({
        collections: [],
        items: [],
        isLoading: true,
        error: null
    })

    const fetchData = React.useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }))

            const [collectionsData, itemsData] = await Promise.all([
                getCollections(),
                getItems()
            ])

            setState({
                collections: collectionsData || [],
                items: itemsData || [],
                isLoading: false,
                error: null
            })
        } catch (error) {
            console.error('Error fetching data:', error)
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: "Failed to load collections data"
            }))
        }
    }, [])

    const refreshCollections = React.useCallback(async () => {
        try {
            const updatedCollections = await getCollections()
            setState(prev => ({
                ...prev,
                collections: updatedCollections || []
            }))
        } catch (error) {
            console.error('Error refreshing collections:', error)
        }
    }, [])

    React.useEffect(() => {
        fetchData()
    }, [fetchData])

    return { ...state, refreshCollections, refetch: fetchData }
}
