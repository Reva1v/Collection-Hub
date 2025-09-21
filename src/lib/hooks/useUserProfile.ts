import * as React from "react";
import { User } from "@/lib/types/User";
import { getCurrentUser } from "@/lib/user/actions";

export interface UseUserProfileReturn {
    userProfile: User | null;
    isLoading: boolean;
    error: string | null;
    setUserProfile: React.Dispatch<React.SetStateAction<User | null>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    refetch: () => Promise<void>;
}

export const useUserProfile = (): UseUserProfileReturn => {
    const [userProfile, setUserProfile] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchUserProfile = React.useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const user = await getCurrentUser();

            if (!user) {
                setError("Failed to load user profile");
                return;
            }

            setUserProfile(user);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            setError("Failed to load user profile");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Загружаем профиль при монтировании компонента
    React.useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    return {
        userProfile,
        isLoading,
        error,
        setUserProfile,
        setError,
        refetch: fetchUserProfile,
    };
};
