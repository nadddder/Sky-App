import { Text, View } from 'react-native';

import { EditScreenInfo } from './EditScreenInfo';
import { useStore } from '~/store/store';
import { router } from 'expo-router';
import { Button } from './ui/button';

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  const { bears, increasePopulation } = useStore()
  return (
    <View className="flex flex-col items-center justify-center gap-4">
      <Text>Total Bears {bears}</Text>
      <Button className='bg-slate-500' onPress={increasePopulation}>Increase</Button>

      <Text className={styles.title}>{title}</Text>
      <Button className='w-1/3 py-2 bg-slate-600' onPress={() => router.push(`/body`)}>Body</Button>
      <View className={styles.separator} />
      <EditScreenInfo path={path} />
      {children}
    </View>
  );
};
const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
