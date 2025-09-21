export const PROFILE_CONFIG = {
    page: {
        title: "Your Profile",
        description: "Manage your personal information and preferences"
    },
    stats: {
        icons: {
            collections: "📚",
            items: "📦",
            daysActive: "📅"
        },
        labels: {
            collections: "Collections",
            items: "Total Items",
            daysActive: "Days Active"
        }
    },
    recentCollections: {
        title: "Recent Collections",
        maxCount: 3
    },
    dock: {
        panelHeight: 68,
        baseItemSize: 50,
        magnification: 70
    },
    clickSpark: {
        color: "#fff",
        size: 10,
        radius: 15,
        count: 8,
        duration: 400
    },
    loading: {
        text: "Loading profile..."
    },
    errorMessages: {
        loadProfile: "Unable to load profile",
        profileNotFound: "Profile not found. Please try again.",
        updateFailed: "Failed to update profile"
    }
} as const;
