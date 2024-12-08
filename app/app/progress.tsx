// app/(app)/progress.tsx
import { ProgressScreen } from '~/components/app/progress-screen';
import DrawerLayout from '~/components/layouts/drawer-layout';

export default function ProgressTab() {
    return (
        <DrawerLayout>
            <ProgressScreen />
        </DrawerLayout>
    );
}