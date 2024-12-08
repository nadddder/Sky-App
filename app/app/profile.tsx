// app/(app)/profile.tsx
import { ProfileScreen } from '~/components/app/profile-screen';
import DrawerLayout from '~/components/layouts/drawer-layout';

export default function ProfileTab() {
    return (
        <DrawerLayout>
            <ProfileScreen />
        </DrawerLayout>
    );
}