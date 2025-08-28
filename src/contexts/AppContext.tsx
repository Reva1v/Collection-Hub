"use client";

import React, {createContext, useContext, useState, useMemo, useEffect, type ReactNode} from "react";
import {motion, AnimatePresence} from "motion/react";

// Типы данных на основе схемы БД
export type CollectStatus = "unknown" | "collected" | "will-not-collect";

export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
}

export interface Collection {
    id: string;
    userId: string;
    name: string;
    description?: string;
    createdAt: Date;
}

export interface Item {
    id: string;
    collectionId: string;
    name: string;
    description: string;
    image?: string;
    type?: string;
    collectStatus: CollectStatus;
    createdAt: Date;
}

// Расширенные типы для работы с связанными данными
export interface CollectionWithItems extends Collection {
    items: Item[];
}

export interface ItemWithCollection extends Item {
    collection: Collection;
}

interface AppContextType {
    // Пользователь
    user: User | null;
    // isAuthenticated: boolean;
    // login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;

    // Коллекции
    collections: Collection[];
    selectedCollection: Collection | null;
    setSelectedCollection: (collection: Collection | null) => void;
    createCollection: (name: string, description?: string) => Promise<Collection | null>;
    updateCollection: (id: string, updates: Partial<Pick<Collection, 'name' | 'description'>>) => Promise<boolean>;
    deleteCollection: (id: string) => Promise<boolean>;

    // Элементы
    items: Item[];
    filteredItems: Item[];
    selectedType: string;
    setSelectedType: (type: string) => void;
    getUniqueTypes: () => string[];
    createItem: (collectionId: string, item: Omit<Item, 'id' | 'createdAt'>) => Promise<Item | null>;
    updateItem: (id: string, updates: Partial<Omit<Item, 'id' | 'createdAt'>>) => Promise<boolean>;
    updateCollectStatus: (id: string, status: CollectStatus) => Promise<boolean>;
    deleteItem: (id: string) => Promise<boolean>;

    // Состояния загрузки
    isLoading: boolean;
    error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
    // Состояния пользователя
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // Состояния данных
    const [collections, setCollections] = useState<Collection[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
    const [selectedType, setSelectedType] = useState<string>("all");

    // Состояния UI
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Проверяем аутентификацию при загрузке
    // useEffect(() => {
    //     checkAuthentication();
    // }, []);

    // Загружаем данные когда пользователь аутентифицирован
    useEffect(() => {
        (async () => {
            await loadUserData();
            setIsInitialized(true);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            // эмуляция загрузки
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setIsInitialized(true);
        })();
    }, []);

    // const checkAuthentication = async () => {
    //     try {
    //         const res = await fetch("/api/auth/me");
    //         if (res.ok) {
    //             const userData = await res.json();
    //             setUser(userData);
    //             setIsAuthenticated(true);
    //         }
    //     } catch (error) {
    //         console.error("Auth check failed:", error);
    //     }
    // };

    const loadUserData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Загружаем коллекции
            const collectionsRes = await fetch("/api/collections");
            if (collectionsRes.ok) {
                const collectionsData = await collectionsRes.json();
                setCollections(collectionsData);
            }

            // Загружаем все элементы пользователя
            const itemsRes = await fetch("/api/items");
            if (itemsRes.ok) {
                const itemsData = await itemsRes.json();
                setItems(itemsData);
            }
        } catch (error) {
            console.error("Failed to load user data:", error);
            setError("Ошибка загрузки данных");
        } finally {
            setIsLoading(false);
        }
    };

    // const login = async (email: string, password: string): Promise<boolean> => {
    //     try {
    //         // Импортируем server action
    //         const {login: loginAction} = await import("@/app/auth/actions");
    //
    //         const formData = new FormData();
    //         formData.append('email', email);
    //         formData.append('password', password);
    //
    //         const result = await loginAction({errors: {}}, formData);
    //
    //         if (!result || result.message || result.errors?.email || result.errors?.password) {
    //             return false;
    //         } else {
    //             // Login successful, load user data
    //             await loadUserData();
    //             return true;
    //         }
    //         // return false;
    //     } catch (error) {
    //         console.error("Login failed:", error);
    //         return false;
    //     }
    // };

    const logout = async () => {
        try {
            const {logout: logoutAction} = await import("@/app/auth/actions");
            await logoutAction();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const createCollection = async (name: string, description?: string): Promise<Collection | null> => {
        try {
            const res = await fetch("/api/collections", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name, description}),
            });

            if (res.ok) {
                const newCollection = await res.json();
                setCollections(prev => [...prev, newCollection]);
                return newCollection;
            }
        } catch (error) {
            console.error("Failed to create collection:", error);
            setError("Ошибка создания коллекции");
        }
        return null;
    };

    const updateCollection = async (id: string, updates: Partial<Pick<Collection, 'name' | 'description'>>): Promise<boolean> => {
        try {
            const res = await fetch(`/api/collections/${id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(updates),
            });

            if (res.ok) {
                const updatedCollection = await res.json();
                setCollections(prev => prev.map(c => c.id === id ? updatedCollection : c));
                if (selectedCollection?.id === id) {
                    setSelectedCollection(updatedCollection);
                }
                return true;
            }
        } catch (error) {
            console.error("Failed to update collection:", error);
            setError("Ошибка обновления коллекции");
        }
        return false;
    };

    const deleteCollection = async (id: string): Promise<boolean> => {
        try {
            const res = await fetch(`/api/collections/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setCollections(prev => prev.filter(c => c.id !== id));
                setItems(prev => prev.filter(item => item.collectionId !== id));
                if (selectedCollection?.id === id) {
                    setSelectedCollection(null);
                }
                return true;
            }
        } catch (error) {
            console.error("Failed to delete collection:", error);
            setError("Ошибка удаления коллекции");
        }
        return false;
    };

    const createItem = async (collectionId: string, itemData: Omit<Item, 'id' | 'createdAt'>): Promise<Item | null> => {
        try {
            const res = await fetch("/api/items", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({...itemData, collectionId}),
            });

            if (res.ok) {
                const newItem = await res.json();
                setItems(prev => [...prev, newItem]);
                return newItem;
            }
        } catch (error) {
            console.error("Failed to create item:", error);
            setError("Ошибка создания элемента");
        }
        return null;
    };

    const updateItem = async (id: string, updates: Partial<Omit<Item, 'id' | 'createdAt'>>): Promise<boolean> => {
        try {
            const res = await fetch(`/api/items/${id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(updates),
            });

            if (res.ok) {
                const updatedItem = await res.json();
                setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
                return true;
            }
        } catch (error) {
            console.error("Failed to update item:", error);
            setError("Ошибка обновления элемента");
        }
        return false;
    };

    const updateCollectStatus = async (id: string, status: CollectStatus): Promise<boolean> => {
        return updateItem(id, {collectStatus: status});
    };

    const deleteItem = async (id: string): Promise<boolean> => {
        try {
            const res = await fetch(`/api/items/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setItems(prev => prev.filter(item => item.id !== id));
                return true;
            }
        } catch (error) {
            console.error("Failed to delete item:", error);
            setError("Ошибка удаления элемента");
        }
        return false;
    };

    // Фильтрованные элементы на основе выбранной коллекции и типа
    const filteredItems = useMemo(() => {
        let filtered = items;

        // Фильтруем по выбранной коллекции
        if (selectedCollection) {
            filtered = filtered.filter(item => item.collectionId === selectedCollection.id);
        }

        // Фильтруем по типу
        if (selectedType !== "all") {
            filtered = filtered.filter(item => item.type === selectedType);
        }

        return filtered;
    }, [items, selectedCollection, selectedType]);

    const getUniqueTypes = (): string[] => {
        const relevantItems = selectedCollection
            ? items.filter(item => item.collectionId === selectedCollection.id)
            : items;

        return [...new Set(relevantItems
            .map(item => item.type)
            .filter((type): type is string => Boolean(type)))];
    };

    return (
        <AppContext.Provider
            value={{
                // Пользователь
                user,
                // isAuthenticated,
                // login,
                logout,

                // Коллекции
                collections,
                selectedCollection,
                setSelectedCollection,
                createCollection,
                updateCollection,
                deleteCollection,

                // Элементы
                items,
                filteredItems,
                selectedType,
                setSelectedType,
                getUniqueTypes,
                createItem,
                updateItem,
                updateCollectStatus,
                deleteItem,

                // Состояния
                isLoading,
                error,
            }}
        >
            <AnimatePresence>
                {!isInitialized && (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]"
                    >
                        <div className="flex flex-col items-center">
                            {/* Спиннер */}
                            <div className="h-14 w-14 animate-spin rounded-full border-4 border-[var(--secondary)] border-t-[var(--accent)]" />

                            {/* Текст */}
                            <p className="mt-6 text-lg font-medium text-[var(--text)]">
                                Loading your collections...
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Контент */}
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};
