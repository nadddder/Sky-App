// components/layouts/drawer-layout.tsx
import { View } from 'react-native';

interface DrawerLayoutProps {
    children: React.ReactNode;
}

export default function DrawerLayout({ children }: DrawerLayoutProps) {

    return (
        <View style={{ flex: 1 }}>
            {children}
        </View>
    );
}