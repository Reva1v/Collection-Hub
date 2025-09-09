// app/(protected)/collections/page.tsx
import ProfilePage from './ProfilePage.tsx'

export default async function ProfilePageServer() {
    return <ProfilePage />
}

export const dynamic = 'force-dynamic' // Всегда получаем свежие данные
