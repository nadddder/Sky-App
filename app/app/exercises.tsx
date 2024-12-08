// app/app/exercises.tsx
import DrawerLayout from '~/components/layouts/drawer-layout';
import { ExercisesScreen } from '~/components/app/exercises-screen';

export default function ExercisesTab() {
    return (
        <DrawerLayout>
            <ExercisesScreen />
        </DrawerLayout>
    );
}